# Custom Font Setup for Galaga Clone

## Required Font Files

Place these font files in the same directory as `galaga_basic.html`:

### Primary Files (in order of preference):
1. **`game-font.woff2`** - Modern web font format (best compression)
2. **`game-font.woff`** - Web font format (good compression)  
3. **`game-font.ttf`** - TrueType font (universal fallback)

## Recommended Font Styles

### Retro Gaming Fonts:
- **Press Start 2P** - Classic 8-bit pixel font
- **Orbitron** - Futuristic/sci-fi style
- **Source Code Pro** - Clean monospace
- **Fira Code** - Modern monospace with character
- **VT323** - Terminal/computer style
- **Russo One** - Bold, game-like

### Where to Find Fonts:
- **Google Fonts** (free) - fonts.google.com
- **Adobe Fonts** (subscription)
- **DaFont** (free) - dafont.com
- **FontSquirrel** (free) - fontsquirrel.com

## Font File Setup

### Option 1: Download from Google Fonts
1. Go to [fonts.google.com](https://fonts.google.com)
2. Search for your desired font (e.g., "Press Start 2P")
3. Click "Download family"
4. Extract the TTF file
5. Convert to web formats (see conversion section)

### Option 2: Use Font Conversion Tools
Convert your TTF to WOFF2/WOFF:
- **Online**: CloudConvert, Convertio
- **Desktop**: FontForge (free)
- **Command line**: woff2_compress (Google tool)

## File Structure
```
/your-game-folder/
├── galaga_basic.html
├── sound.js
├── game-font.woff2    (preferred)
├── game-font.woff     (fallback 1)
├── game-font.ttf      (fallback 2)
├── enemy_type1.png
├── enemy_type2.png
└── enemy_type3.png
```

## Font Implementation

The game uses a cascading font stack:
```css
font-family: 'GameFont', 'Courier New', monospace;
```

### Fallback Order:
1. **GameFont** - Your custom font
2. **Courier New** - System monospace font
3. **monospace** - Generic monospace fallback

## Styling Features

### Applied to:
- **Score display** - Top-left game info
- **Instructions** - Control hints at bottom
- **Game messages** - Pause, Game Over, Victory, Level Complete
- **Body text** - Overall page font

### Visual Enhancements:
- **Text shadow** on score display for better readability
- **Letter spacing** for improved legibility
- **Font display: swap** for better loading performance

## Testing Your Font

### Browser Testing:
1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Refresh the page
4. Look for font file requests
5. Check if fonts load successfully

### Visual Verification:
- Compare text appearance with/without custom font
- Test on different browsers (Chrome, Firefox, Safari)
- Verify fallbacks work when font files are missing

## Performance Tips

### File Size Optimization:
- **WOFF2** provides ~30% better compression than WOFF
- Remove unused characters from font files (subsetting)
- Use `font-display: swap` for faster text rendering

### Loading Strategy:
- Fonts load asynchronously (won't block game)
- Fallback fonts display immediately
- Custom font swaps in when loaded
- No impact on gameplay if fonts fail to load

## Popular Retro Font Recommendations

### For Score/UI Text:
- **Press Start 2P** - Classic arcade feel
- **Orbitron** - Space/sci-fi theme
- **Russo One** - Bold gaming style

### For Monospace Needs:
- **Source Code Pro** - Clean, readable
- **Fira Code** - Modern with character
- **VT323** - Authentic terminal look

## Troubleshooting

### Font Not Loading:
1. Check file paths are correct
2. Verify font files aren't corrupted
3. Test different browsers
4. Check browser console for errors
5. Ensure server serves font files correctly

### CORS Issues (if loading from CDN):
Add to server headers:
```
Access-Control-Allow-Origin: *
```

Or use Google Fonts CDN:
```html
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
``` 