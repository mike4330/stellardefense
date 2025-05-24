 # Enemy Sprite Setup for Galaga Clone

## Required Image Files

Place these PNG files in the same directory as `galaga_basic.html`:

### 1. `enemy_type1.png`
- **Size**: 20x20 pixels
- **Format**: PNG with transparency
- **Design**: Red diamond-shaped enemy (fast moving)
- **Style**: Pixel art, high contrast

### 2. `enemy_type2.png`
- **Size**: 24x24 pixels  
- **Format**: PNG with transparency
- **Design**: Blue cross-shaped enemy (slower, worth more points)
- **Style**: Pixel art, high contrast

### 3. `enemy_type3.png`
- **Size**: 28x28 pixels
- **Format**: PNG with transparency
- **Design**: New enemy type (purple, triangular suggested)
- **Style**: Pixel art, high contrast

## Design Guidelines

### Color Recommendations:
- **Type 1**: Red tones (#ff0000, #cc0000, #880000)
- **Type 2**: Blue tones (#0066ff, #0044cc, #002288)
- **Type 3**: Purple tones (#8844ff, #6622cc, #441188)

### Technical Requirements:
- **Transparent background** (PNG alpha channel)
- **Pixel-perfect edges** (no anti-aliasing for retro look)
- **High contrast** against black background
- **Simple designs** that read well at small sizes

## Fallback Behavior

If image files are not found or fail to load:
- The game automatically falls back to the original shape-based enemies
- Console messages will indicate loading status
- Game continues to work normally

## Creating Sprite Images

### Recommended Tools:
- **Aseprite** (pixel art specialized)
- **GIMP** (free, full-featured)
- **Photoshop** (professional)
- **Paint.NET** (Windows, free)
- **Pixelmator** (Mac)

### Quick Tips:
1. Work at actual size (20x20, 24x24, 28x28)
2. Use the pencil tool, not brush, for crisp pixels
3. Save as PNG-24 with transparency
4. Test against black background
5. Keep designs symmetrical for better visual balance

## File Structure
```
/your-game-folder/
├── galaga_basic.html
├── sound.js
├── enemy_type1.png    (20x20)
├── enemy_type2.png    (24x24)
└── enemy_type3.png    (28x28)
```

## Testing
Open browser console (F12) to see image loading messages:
- "Type X enemy image loaded" = Success
- "Type X enemy image failed to load" = Using fallback shapes 