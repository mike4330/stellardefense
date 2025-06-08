#!/usr/bin/env python3
"""
Stellar Defense Level Configuration Editor
A console-based spreadsheet-like interface for editing game levels
"""

import json
import re
import os
import sys
import curses
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from tabulate import tabulate

@dataclass
class GlobalConfig:
    maxEnemies: int
    spawnTimeWindow: float
    collisionSeparation: float
    wrapBuffer: int
    speedMultiplier: float
    eccentricityMultiplier: float
    scoreBonus: int = 0

@dataclass
class LevelConfig:
    name: str
    allowedEnemyTypes: List[int]
    global_config: GlobalConfig

class LevelEditor:
    def __init__(self):
        self.levels: Dict[int, LevelConfig] = {}
        self.current_file: Optional[str] = None
        self.modified = False
        
    def parse_js_file(self, filename: str) -> bool:
        """Parse the JavaScript level_config.js file"""
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract the levelConfigs object using regex
            pattern = r'const\s+levelConfigs\s*=\s*(\{.*?\});'
            match = re.search(pattern, content, re.DOTALL)
            
            if not match:
                print(f"Error: Could not find levelConfigs object in {filename}")
                return False
            
            js_object = match.group(1)
            
            # Convert JavaScript object notation to JSON
            # Handle comments (remove them) - do this first
            js_object = re.sub(r'//.*?$', '', js_object, flags=re.MULTILINE)
            # Replace single quotes with double quotes
            js_object = re.sub(r"'([^']*)'", r'"\1"', js_object)
            # Handle property names without quotes
            js_object = re.sub(r'(\w+):', r'"\1":', js_object)
            # Fix decimal numbers starting with dot (e.g., .6 -> 0.6)
            js_object = re.sub(r'(\s|:)\.(\d+)', r'\g<1>0.\2', js_object)
            # Remove trailing commas before closing braces/brackets
            js_object = re.sub(r',(\s*[}\]])', r'\1', js_object)
            
            try:
                data = json.loads(js_object)
            except json.JSONDecodeError as e:
                print(f"Error parsing JavaScript object: {e}")
                return False
            
            # Convert to our data structure
            self.levels.clear()
            for level_num_str, level_data in data.items():
                level_num = int(level_num_str)
                global_data = level_data['global']
                
                global_config = GlobalConfig(
                    maxEnemies=global_data['maxEnemies'],
                    spawnTimeWindow=global_data['spawnTimeWindow'],
                    collisionSeparation=global_data['collisionSeparation'],
                    wrapBuffer=global_data['wrapBuffer'],
                    speedMultiplier=global_data['speedMultiplier'],
                    eccentricityMultiplier=global_data['eccentricityMultiplier'],
                    scoreBonus=global_data.get('scoreBonus', 0)
                )
                
                level_config = LevelConfig(
                    name=level_data['name'],
                    allowedEnemyTypes=level_data['allowedEnemyTypes'],
                    global_config=global_config
                )
                
                self.levels[level_num] = level_config
            
            self.current_file = filename
            self.modified = False
            print(f"Successfully loaded {len(self.levels)} levels from {filename}")
            return True
            
        except FileNotFoundError:
            print(f"Error: File {filename} not found")
            return False
        except Exception as e:
            print(f"Error reading file {filename}: {e}")
            return False
    
    def save_js_file(self, filename: Optional[str] = None) -> bool:
        """Save the configuration back to JavaScript format"""
        if filename is None:
            filename = self.current_file
        
        if filename is None:
            print("Error: No filename specified")
            return False
        
        try:
            # Generate JavaScript content
            js_content = '''/**
 * Level configuration object that defines the behavior and parameters for each game level.
 * Each level has a unique configuration for different enemy types and global settings.
 * 
 * Structure:
 * {
 *   [levelNumber]: {
 *     name: string,              // Display name of the level (e.g. "1 Alpha")
 *     allowedEnemyTypes: number[], // Array of allowed enemy types (1, 2, 3)
 *     global: {                  // Global level settings
 *       maxEnemies: number,      // Maximum number of enemies allowed in the level
 *       spawnTimeWindow: number, // Time window in seconds to spawn all enemies
 *       collisionSeparation: number, // Force applied to separate colliding enemies
 *       wrapBuffer: number,      // Distance from top before enemies wrap around
 *       speedMultiplier: number, // Multiplier applied to all enemy speeds
 *       eccentricityMultiplier: number // Multiplier for enemy direction change probability
 *     }
 *   }
 * }
 */
const levelConfigs = {
'''
            
            for level_num in sorted(self.levels.keys()):
                level = self.levels[level_num]
                js_content += f'    {level_num}: {{\n'
                js_content += f'        name: "{level.name}",\n'
                js_content += f'        allowedEnemyTypes: {level.allowedEnemyTypes},\n'
                js_content += f'        global: {{\n'
                js_content += f'            maxEnemies: {level.global_config.maxEnemies},\n'
                js_content += f'            spawnTimeWindow: {level.global_config.spawnTimeWindow},\n'
                js_content += f'            collisionSeparation: {level.global_config.collisionSeparation},\n'
                js_content += f'            wrapBuffer: {level.global_config.wrapBuffer},\n'
                js_content += f'            speedMultiplier: {level.global_config.speedMultiplier},\n'
                js_content += f'            eccentricityMultiplier: {level.global_config.eccentricityMultiplier}'
                
                if level.global_config.scoreBonus > 0:
                    js_content += f',\n            scoreBonus: {level.global_config.scoreBonus}'
                
                js_content += f'\n        }}\n'
                js_content += f'    }}'
                
                if level_num != max(self.levels.keys()):
                    js_content += ','
                js_content += '\n'
            
            js_content += '}; \n'
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(js_content)
            
            self.modified = False
            print(f"Successfully saved {len(self.levels)} levels to {filename}")
            return True
            
        except Exception as e:
            print(f"Error saving file {filename}: {e}")
            return False
    
    def display_spreadsheet(self, start_level: int = 1, max_rows: int = 20):
        """Display levels in a spreadsheet-like format"""
        if not self.levels:
            print("No levels loaded. Use 'load <filename>' to load a configuration file.")
            return
        
        # Get range of levels to display
        sorted_levels = sorted(self.levels.keys())
        if start_level not in sorted_levels:
            start_level = sorted_levels[0]
        
        start_idx = sorted_levels.index(start_level)
        end_idx = min(start_idx + max_rows, len(sorted_levels))
        display_levels = sorted_levels[start_idx:end_idx]
        
        # Prepare table data
        headers = [
            "Level", "Name", "Enemy Types", "Max Enemies", "Spawn Time", 
            "Collision Sep", "Wrap Buffer", "Speed Mult", "Eccentricity", "Score Bonus"
        ]
        
        rows = []
        for level_num in display_levels:
            level = self.levels[level_num]
            gc = level.global_config
            
            enemy_types_str = ','.join(map(str, level.allowedEnemyTypes))
            
            row = [
                level_num,
                level.name,
                enemy_types_str,
                gc.maxEnemies,
                f"{gc.spawnTimeWindow:.1f}",
                f"{gc.collisionSeparation:.1f}",
                gc.wrapBuffer,
                f"{gc.speedMultiplier:.2f}",
                f"{gc.eccentricityMultiplier:.2f}",
                gc.scoreBonus
            ]
            rows.append(row)
        
        print(f"\nLevel Configuration (Showing levels {display_levels[0]}-{display_levels[-1]} of {len(self.levels)} total)")
        print("=" * 120)
        print(tabulate(rows, headers=headers, tablefmt="grid", floatfmt=".2f"))
        
        if end_idx < len(sorted_levels):
            print(f"\n... and {len(sorted_levels) - end_idx} more levels. Use 'view {sorted_levels[end_idx]}' to see more.")
    
    def edit_level(self, level_num: int, field: str, value: str) -> bool:
        """Edit a specific field of a level"""
        if level_num not in self.levels:
            print(f"Error: Level {level_num} does not exist")
            return False
        
        level = self.levels[level_num]
        
        try:
            if field == "name":
                level.name = value
            elif field == "enemyTypes" or field == "allowedEnemyTypes":
                # Parse comma-separated list of integers
                enemy_types = [int(x.strip()) for x in value.split(',')]
                level.allowedEnemyTypes = enemy_types
            elif field == "maxEnemies":
                level.global_config.maxEnemies = int(value)
            elif field == "spawnTime" or field == "spawnTimeWindow":
                level.global_config.spawnTimeWindow = float(value)
            elif field == "collisionSep" or field == "collisionSeparation":
                level.global_config.collisionSeparation = float(value)
            elif field == "wrapBuffer":
                level.global_config.wrapBuffer = int(value)
            elif field == "speedMult" or field == "speedMultiplier":
                level.global_config.speedMultiplier = float(value)
            elif field == "eccentricity" or field == "eccentricityMultiplier":
                level.global_config.eccentricityMultiplier = float(value)
            elif field == "scoreBonus":
                level.global_config.scoreBonus = int(value)
            else:
                print(f"Error: Unknown field '{field}'")
                print("Available fields: name, enemyTypes, maxEnemies, spawnTime, collisionSep, wrapBuffer, speedMult, eccentricity, scoreBonus")
                return False
            
            self.modified = True
            print(f"Updated level {level_num} {field} to {value}")
            return True
            
        except ValueError as e:
            print(f"Error: Invalid value '{value}' for field '{field}': {e}")
            return False
    
    def add_level(self, level_num: int) -> bool:
        """Add a new level with default values"""
        if level_num in self.levels:
            print(f"Error: Level {level_num} already exists")
            return False
        
        # Create with default values
        global_config = GlobalConfig(
            maxEnemies=30,
            spawnTimeWindow=45.0,
            collisionSeparation=2.0,
            wrapBuffer=50,
            speedMultiplier=1.0,
            eccentricityMultiplier=1.0,
            scoreBonus=0
        )
        
        level_config = LevelConfig(
            name=f"{level_num} New",
            allowedEnemyTypes=[1, 2],
            global_config=global_config
        )
        
        self.levels[level_num] = level_config
        self.modified = True
        print(f"Added new level {level_num}")
        return True
    
    def delete_level(self, level_num: int) -> bool:
        """Delete a level"""
        if level_num not in self.levels:
            print(f"Error: Level {level_num} does not exist")
            return False
        
        del self.levels[level_num]
        self.modified = True
        print(f"Deleted level {level_num}")
        return True
    
    def copy_level(self, source: int, dest: int) -> bool:
        """Copy a level to a new level number"""
        if source not in self.levels:
            print(f"Error: Source level {source} does not exist")
            return False
        
        if dest in self.levels:
            print(f"Error: Destination level {dest} already exists")
            return False
        
        # Deep copy the level
        source_level = self.levels[source]
        new_global = GlobalConfig(
            maxEnemies=source_level.global_config.maxEnemies,
            spawnTimeWindow=source_level.global_config.spawnTimeWindow,
            collisionSeparation=source_level.global_config.collisionSeparation,
            wrapBuffer=source_level.global_config.wrapBuffer,
            speedMultiplier=source_level.global_config.speedMultiplier,
            eccentricityMultiplier=source_level.global_config.eccentricityMultiplier,
            scoreBonus=source_level.global_config.scoreBonus
        )
        
        new_level = LevelConfig(
            name=source_level.name + " Copy",
            allowedEnemyTypes=source_level.allowedEnemyTypes.copy(),
            global_config=new_global
        )
        
        self.levels[dest] = new_level
        self.modified = True
        print(f"Copied level {source} to level {dest}")
        return True
    
    def run_console(self):
        """Main console interface"""
        print("Galaga Level Configuration Editor")
        print("Type 'help' for available commands")
        
        while True:
            try:
                if self.modified:
                    prompt = f"[MODIFIED] > "
                else:
                    prompt = "> "
                
                command = input(prompt).strip()
                
                if not command:
                    continue
                
                parts = command.split()
                cmd = parts[0].lower()
                
                if cmd in ['quit', 'exit', 'q']:
                    if self.modified:
                        response = input("You have unsaved changes. Save before quitting? (y/n): ")
                        if response.lower() in ['y', 'yes']:
                            if self.current_file:
                                self.save_js_file()
                            else:
                                filename = input("Enter filename to save: ")
                                self.save_js_file(filename)
                    break
                
                elif cmd == 'help':
                    self.show_help()
                
                elif cmd == 'load':
                    if len(parts) < 2:
                        print("Usage: load <filename>")
                    else:
                        self.parse_js_file(parts[1])
                
                elif cmd == 'save':
                    if len(parts) >= 2:
                        self.save_js_file(parts[1])
                    else:
                        self.save_js_file()
                
                elif cmd in ['view', 'show', 'display']:
                    if len(parts) >= 2:
                        try:
                            start_level = int(parts[1])
                            self.display_spreadsheet(start_level)
                        except ValueError:
                            print("Error: Invalid level number")
                    else:
                        self.display_spreadsheet()
                
                elif cmd == 'edit':
                    if len(parts) < 4:
                        print("Usage: edit <level_num> <field> <value>")
                        print("Example: edit 1 maxEnemies 25")
                    else:
                        try:
                            level_num = int(parts[1])
                            field = parts[2]
                            value = ' '.join(parts[3:])  # Allow spaces in values
                            self.edit_level(level_num, field, value)
                        except ValueError:
                            print("Error: Invalid level number")
                
                elif cmd == 'add':
                    if len(parts) < 2:
                        print("Usage: add <level_num>")
                    else:
                        try:
                            level_num = int(parts[1])
                            self.add_level(level_num)
                        except ValueError:
                            print("Error: Invalid level number")
                
                elif cmd in ['delete', 'del']:
                    if len(parts) < 2:
                        print("Usage: delete <level_num>")
                    else:
                        try:
                            level_num = int(parts[1])
                            self.delete_level(level_num)
                        except ValueError:
                            print("Error: Invalid level number")
                
                elif cmd == 'copy':
                    if len(parts) < 3:
                        print("Usage: copy <source_level> <dest_level>")
                    else:
                        try:
                            source = int(parts[1])
                            dest = int(parts[2])
                            self.copy_level(source, dest)
                        except ValueError:
                            print("Error: Invalid level number")
                
                elif cmd == 'list':
                    if self.levels:
                        sorted_levels = sorted(self.levels.keys())
                        print(f"Available levels: {', '.join(map(str, sorted_levels))}")
                    else:
                        print("No levels loaded")
                
                elif cmd in ['spreadsheet', 'grid', 'excel']:
                    if self.levels:
                        print("Launching spreadsheet mode...")
                        self.run_spreadsheet_mode()
                        print("Returned from spreadsheet mode.")
                    else:
                        print("No levels loaded. Load a file first.")
                
                else:
                    print(f"Unknown command: {cmd}. Type 'help' for available commands.")
            
            except KeyboardInterrupt:
                print("\nUse 'quit' to exit")
            except EOFError:
                break
    
    def show_help(self):
        """Display help information"""
        help_text = """
Available Commands:
==================

File Operations:
  load <filename>           - Load level configuration from JavaScript file
  save [filename]           - Save configuration (to current file or new file)

Viewing:
  view [start_level]        - Display spreadsheet view of levels
  list                      - List all available level numbers
  spreadsheet               - Launch interactive spreadsheet mode with arrow keys

Editing:
  edit <level> <field> <value>  - Edit a specific field of a level
  add <level_num>           - Add a new level with default values
  copy <source> <dest>      - Copy a level to a new level number
  delete <level_num>        - Delete a level

Available Fields for Editing:
  name                      - Level name (string)
  enemyTypes               - Allowed enemy types (comma-separated: 1,2,3)
  maxEnemies               - Maximum enemies in level (integer)
  spawnTime                - Time window to spawn enemies (float seconds)
  collisionSep             - Collision separation force (float)
  wrapBuffer               - Wrap buffer distance (integer)
  speedMult                - Speed multiplier (float)
  eccentricity             - Eccentricity multiplier (float)
  scoreBonus               - Score bonus (integer)

Examples:
  load level_config.js
  view 5                    - View levels starting from level 5
  edit 1 name "1 Alpha Advanced"
  edit 3 maxEnemies 45
  edit 2 enemyTypes 1,2,3,4
  copy 1 15                 - Copy level 1 to level 15
  add 20                    - Add new level 20
  spreadsheet               - Launch interactive mode

Spreadsheet Mode Controls:
  Arrow Keys               - Navigate between cells
  Enter                    - Edit current cell
  Esc                      - Cancel editing
  s                        - Save changes
  q                        - Quit to console mode

Navigation:
  quit, exit, q            - Exit the editor
  help                     - Show this help
"""
        print(help_text)
    
    def run_curses_interface(self, stdscr):
        """Curses-based spreadsheet interface with arrow key navigation and inline editing"""
        curses.curs_set(0)  # Hide cursor initially
        stdscr.clear()
        
        if not self.levels:
            stdscr.addstr(0, 0, "No levels loaded. Press 'q' to quit and use console mode to load a file.")
            stdscr.getch()
            return
        
        # Initialize colors
        curses.start_color()
        curses.init_pair(1, curses.COLOR_BLACK, curses.COLOR_CYAN)    # Header
        curses.init_pair(2, curses.COLOR_WHITE, curses.COLOR_BLUE)    # Selected cell
        curses.init_pair(3, curses.COLOR_YELLOW, curses.COLOR_BLACK)  # Modified indicator
        curses.init_pair(4, curses.COLOR_GREEN, curses.COLOR_BLACK)   # Status line
        
        # Get terminal size
        max_y, max_x = stdscr.getmaxyx()
        
        # Define column layout
        self.setup_columns()
        
        # Current position
        current_row = 0
        current_col = 0
        top_row = 0
        editing = False
        edit_buffer = ""
        
        while True:
            stdscr.clear()
            
            # Get sorted levels for consistent ordering
            sorted_levels = sorted(self.levels.keys())
            visible_rows = min(max_y - 4, len(sorted_levels))  # Leave space for header and status
            
            # Adjust top_row if needed
            if current_row < top_row:
                top_row = current_row
            elif current_row >= top_row + visible_rows:
                top_row = current_row - visible_rows + 1
            
            # Draw header
            self.draw_header(stdscr, max_x)
            
            # Draw data rows
            for i in range(visible_rows):
                row_idx = top_row + i
                if row_idx >= len(sorted_levels):
                    break
                    
                level_num = sorted_levels[row_idx]
                level = self.levels[level_num]
                
                y_pos = i + 2  # Skip header rows
                self.draw_level_row(stdscr, level_num, level, y_pos, max_x, 
                                  current_row == row_idx, current_col, editing, edit_buffer)
            
            # Draw status line
            status = f"Level {current_row + 1}/{len(sorted_levels)} | "
            status += f"Col: {self.columns[current_col]['name']} | "
            status += "EDITING" if editing else "NAVIGATE"
            status += " | Arrows: move, Enter: edit, Esc: cancel, s: save, q: quit"
            
            try:
                stdscr.addstr(max_y - 2, 0, status[:max_x-1], curses.color_pair(4))
            except curses.error:
                pass
            
            if self.modified:
                try:
                    stdscr.addstr(max_y - 1, 0, "[MODIFIED]", curses.color_pair(3))
                except curses.error:
                    pass
            
            stdscr.refresh()
            
            # Handle input
            key = stdscr.getch()
            
            if editing:
                if key == 27:  # ESC
                    editing = False
                    edit_buffer = ""
                    curses.curs_set(0)
                elif key == ord('\n') or key == ord('\r'):  # Enter
                    if self.apply_edit(sorted_levels[current_row], current_col, edit_buffer):
                        editing = False
                        edit_buffer = ""
                        curses.curs_set(0)
                elif key == curses.KEY_BACKSPACE or key == 127:
                    edit_buffer = edit_buffer[:-1]
                elif key >= 32 and key <= 126:  # Printable characters
                    edit_buffer += chr(key)
            else:
                if key == ord('q'):
                    if self.modified:
                        try:
                            stdscr.addstr(max_y - 1, 0, "Save before quitting? (y/n): ")
                            stdscr.refresh()
                            response = stdscr.getch()
                            if response == ord('y'):
                                self.save_js_file()
                        except curses.error:
                            pass
                    break
                elif key == ord('s'):
                    self.save_js_file()
                elif key == curses.KEY_UP and current_row > 0:
                    current_row -= 1
                elif key == curses.KEY_DOWN and current_row < len(sorted_levels) - 1:
                    current_row += 1
                elif key == curses.KEY_LEFT and current_col > 0:
                    current_col -= 1
                elif key == curses.KEY_RIGHT and current_col < len(self.columns) - 1:
                    current_col += 1
                elif key == ord('\n') or key == ord('\r'):  # Enter to edit
                    current_value = self.get_cell_value(sorted_levels[current_row], current_col)
                    edit_buffer = str(current_value)
                    editing = True
                    curses.curs_set(1)  # Show cursor
    
    def setup_columns(self):
        """Define the column layout for the spreadsheet"""
        self.columns = [
            {'name': 'Level', 'width': 8, 'field': 'level_num', 'type': 'int'},
            {'name': 'Name', 'width': 12, 'field': 'name', 'type': 'str'},
            {'name': 'Enemy Types', 'width': 20, 'field': 'allowedEnemyTypes', 'type': 'list'},
            {'name': 'Max Enemies', 'width': 12, 'field': 'maxEnemies', 'type': 'int'},
            {'name': 'Spawn Time', 'width': 12, 'field': 'spawnTimeWindow', 'type': 'float'},
            {'name': 'Collision Sep', 'width': 14, 'field': 'collisionSeparation', 'type': 'float'},
            {'name': 'Wrap Buffer', 'width': 12, 'field': 'wrapBuffer', 'type': 'int'},
            {'name': 'Speed Mult', 'width': 12, 'field': 'speedMultiplier', 'type': 'float'},
            {'name': 'Eccentricity', 'width': 14, 'field': 'eccentricityMultiplier', 'type': 'float'},
            {'name': 'Score Bonus', 'width': 12, 'field': 'scoreBonus', 'type': 'int'},
        ]
    
    def draw_header(self, stdscr, max_x):
        """Draw the column headers"""
        x_pos = 0
        for i, col in enumerate(self.columns):
            if x_pos >= max_x - col['width'] - 1:  # Account for separator
                break
            header_text = col['name'][:col['width']].ljust(col['width'])
            try:
                stdscr.addstr(0, x_pos, header_text, curses.color_pair(1))
                # Add vertical separator after each column (except the last visible one)
                if x_pos + col['width'] < max_x - 1:
                    stdscr.addstr(0, x_pos + col['width'], "|", curses.color_pair(1))
            except curses.error:
                break
            x_pos += col['width'] + 1  # +1 for the separator
        
        # Draw horizontal separator line
        separator_chars = []
        sep_x = 0
        for i, col in enumerate(self.columns):
            if sep_x >= max_x - col['width'] - 1:
                break
            # Add dashes for the column width
            separator_chars.extend(["-"] * col['width'])
            # Add cross or vertical line at separator position
            if sep_x + col['width'] < max_x - 1:
                separator_chars.append("+")
            sep_x += col['width'] + 1
        
        separator_line = "".join(separator_chars)
        if len(separator_line) > 0:
            try:
                stdscr.addstr(1, 0, separator_line[:max_x-1])
            except curses.error:
                pass
    
    def draw_level_row(self, stdscr, level_num, level, y_pos, max_x, is_current_row, current_col, editing, edit_buffer):
        """Draw a single level row"""
        x_pos = 0
        
        for col_idx, col in enumerate(self.columns):
            if x_pos >= max_x - col['width'] - 1:  # Account for separator
                break
                
            # Get cell value
            if editing and is_current_row and col_idx == current_col:
                cell_text = edit_buffer
            else:
                cell_value = self.get_cell_value(level_num, col_idx)
                cell_text = str(cell_value)
            
            # Truncate and pad text
            cell_text = cell_text[:col['width']].ljust(col['width'])
            
            # Apply highlighting
            attr = curses.A_NORMAL
            if is_current_row and col_idx == current_col:
                attr = curses.color_pair(2)
            
            try:
                stdscr.addstr(y_pos, x_pos, cell_text, attr)
                # Add vertical separator after each column (except the last visible one)
                if x_pos + col['width'] < max_x - 1:
                    stdscr.addstr(y_pos, x_pos + col['width'], "|", curses.A_NORMAL)
            except curses.error:
                break
            x_pos += col['width'] + 1  # +1 for the separator
    
    def get_cell_value(self, level_num, col_idx):
        """Get the value for a specific cell"""
        col = self.columns[col_idx]
        field = col['field']
        
        if field == 'level_num':
            return level_num
        
        level = self.levels[level_num]
        
        if field in ['name', 'allowedEnemyTypes']:
            value = getattr(level, field)
        else:
            value = getattr(level.global_config, field)
        
        if field == 'allowedEnemyTypes':
            return ','.join(map(str, value))
        
        return value
    
    def apply_edit(self, level_num, col_idx, new_value):
        """Apply an edit to a cell"""
        col = self.columns[col_idx]
        field = col['field']
        field_type = col['type']
        
        # Level number cannot be edited
        if field == 'level_num':
            return False
        
        try:
            # Parse the new value based on type
            if field_type == 'int':
                parsed_value = int(new_value)
            elif field_type == 'float':
                parsed_value = float(new_value)
            elif field_type == 'list':
                # Parse comma-separated integers
                parsed_value = [int(x.strip()) for x in new_value.split(',') if x.strip()]
            else:  # str
                parsed_value = new_value
            
            # Apply the change
            level = self.levels[level_num]
            
            if field in ['name', 'allowedEnemyTypes']:
                setattr(level, field, parsed_value)
            else:
                setattr(level.global_config, field, parsed_value)
            
            self.modified = True
            return True
            
        except ValueError:
            return False
    
    def run_spreadsheet_mode(self):
        """Launch the curses-based spreadsheet interface"""
        try:
            curses.wrapper(self.run_curses_interface)
        except KeyboardInterrupt:
            pass

def main():
    editor = LevelEditor()
    
    # Always try to load level_config.js from the same directory as this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    config_file = os.path.join(script_dir, "level_config.js")
    
    print(f"Attempting to load: {config_file}")
    if editor.parse_js_file(config_file):
        print("Level configuration loaded successfully!")
        print("Launching spreadsheet mode... (use 'q' to quit to console mode)")
        editor.run_spreadsheet_mode()
    else:
        print("Failed to load level_config.js - you can still use the editor to create new levels")
    
    editor.run_console()

if __name__ == "__main__":
    main()
