# Stellar Defense

A classic space shooter game built with HTML5 Canvas and JavaScript, inspired by retro arcade games like Galaga.

![Stellar Defense](./preview.png)

## 🎮 Game Features

### Core Gameplay
- **Multiple Enemy Types**: 6 different enemy types with unique behaviors and movement patterns
- **Progressive Difficulty**: 14 challenging levels with increasing complexity
- **Power System**: Burst fire mechanics with cooldown periods
- **Lives System**: Start with 3 lives, earn extra lives at score milestones
- **High Score System**: Local storage-based leaderboard with player names

### Enemy Types
1. **Type 1** (Green): Basic enemies with simple movement patterns
2. **Type 2** (Blue): Slightly more erratic movement
3. **Type 3** (Red): Faster with increased directional changes
4. **Type 4** (Yellow): Circular collision detection and force field capabilities
5. **Type 5** (Orange): Advanced enemies that can shoot back at the player
6. **Type 6** (Purple): High retrograde capability - can reverse direction anywhere

### Advanced Features
- **Force Field System**: Type 4 enemies can activate deflective shields
- **Enemy Bullets**: Type 5 enemies fire projectiles at the player
- **Collision Avoidance**: Intelligent enemy separation system
- **Visual Effects**: Explosions, starfield animations, and level-specific themes
- **Sound System**: Complete audio feedback for all game events
- **Level Progression**: Smooth transitions between levels with victory screens

### Control System
- **Arrow Keys**: Move your ship (smooth acceleration/deceleration)
- **Spacebar**: Fire weapons (5-shot burst with cooldown)
- **P/Escape**: Pause/unpause game
- **R**: Restart game
- **Q**: Quit game (with high score check)
- **H**: View high scores
- **D**: Toggle debug mode

### Debug Features
- **Level Teleportation**: Press `j` + level number + Enter to jump to any level
- **Real-time Statistics**: Enemy counts, spawn timers, and collision data
- **Performance Monitoring**: Frame rate and game state information

## 🚀 Getting Started

### Prerequisites
- Modern web browser with HTML5 Canvas support
- No additional dependencies required

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/mike4330/stellardefense.git
   ```

2. Navigate to the project directory:
   ```bash
   cd stellardefense
   ```

3. Open `galaga_basic.html` in your web browser or serve it with a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   ```

4. Navigate to `http://localhost:8000` and open `galaga_basic.html`

## 🎯 How to Play

1. **Start**: Click "START GAME" to begin
2. **Movement**: Use arrow keys to navigate your ship
3. **Shooting**: Press and hold spacebar to fire in 5-shot bursts
4. **Survival**: Avoid enemy ships and their projectiles
5. **Progression**: Destroy all enemies in a level to advance
6. **Lives**: You start with 3 lives and can earn more at 10K, 21K, 44K, and 92K points

### Scoring System
- Type 1 Enemies: 20 points
- Type 2 Enemies: 30 points  
- Type 3 Enemies: 45 points
- Type 4 Enemies: 60 points
- Type 5 Enemies: 75 points
- Type 6 Enemies: 90 points

Bonus points are awarded based on level difficulty multipliers.

## 📁 Project Structure

```
stellardefense/
├── galaga_basic.html      # Main game file
├── styles.css             # Game styling and UI
├── sound.js              # Audio system and sound effects
├── level_config.js       # Level definitions and enemy configurations
├── visual_effects.js     # Rendering engine and visual effects
├── high_scores.js        # High score management system
└── README.md            # This file
```

## 🎨 Technical Features

### Audio System
- Web Audio API implementation
- Oscillator-based sound generation
- Multiple sound effects (shooting, explosions, enemy sounds)
- Audio context initialization on user interaction

### Visual Engine
- Hardware-accelerated Canvas rendering
- Particle system for explosions
- Dynamic starfield with level-specific themes
- Smooth animation systems with 60 FPS targeting

### Game Engine
- Entity-component system architecture
- Collision detection with circular and rectangular support
- Spawn scheduling system for balanced gameplay
- State management for pause/resume functionality

### Data Persistence
- LocalStorage-based high score system
- Persistent player statistics
- Cross-session score tracking

## 🔧 Development

### Debug Mode
Enable debug mode by pressing `D` during gameplay to access:
- Enemy spawn monitoring
- Performance metrics
- Level teleportation (`j` + number + Enter)
- Real-time game state information

### Customization
- **Levels**: Modify `level_config.js` to create new levels
- **Enemies**: Adjust enemy behaviors in the base configuration
- **Visuals**: Update `visual_effects.js` for new visual elements
- **Audio**: Extend `sound.js` for additional sound effects

## 🎮 Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support  
- **Safari**: Full support
- **Edge**: Full support

Requires browsers with HTML5 Canvas and Web Audio API support.

## 📝 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🎯 Future Enhancements

- [ ] Multiplayer support
- [ ] Power-up system
- [ ] Boss enemies
- [ ] Mobile touch controls
- [ ] WebGL renderer option
- [ ] Level editor
- [ ] Achievement system
- [ ] Replay system

## 👨‍💻 Author

**Mike4330**
- GitHub: [@mike4330](https://github.com/mike4330)

## 🙏 Acknowledgments

- Inspired by classic arcade games like Galaga and Space Invaders
- Built with modern web technologies for enhanced performance
- Community feedback and testing contributions

---

**Play Stellar Defense and defend the galaxy!** 🚀✨ 