# Contributing to Stellar Defense

Thank you for your interest in contributing to Stellar Defense! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Basic knowledge of HTML5, CSS3, and JavaScript
- Understanding of Canvas API for graphics rendering
- Familiarity with Web Audio API (for sound contributions)

### Development Setup
1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/stellardefense.git
   cd stellardefense
   ```
3. Start a local development server:
   ```bash
   python3 -m http.server 8000
   # or
   npm start
   ```
4. Open `http://localhost:8000` in your browser

## 📝 How to Contribute

### Reporting Bugs
When reporting bugs, please include:
- Browser and version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)

### Suggesting Features
- Check existing issues first
- Provide detailed description of the feature
- Explain the use case and benefits
- Consider implementation complexity

### Code Contributions

#### Pull Request Process
1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test thoroughly across different browsers
4. Commit with clear messages: `git commit -m "Add: new enemy type with special abilities"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Open a Pull Request

#### Code Style Guidelines
- Use consistent indentation (4 spaces)
- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing code patterns
- Keep functions focused and small

#### Testing
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Verify game performance (60 FPS target)
- Check mobile responsiveness
- Test all game features and controls

## 🎮 Game Architecture

### File Structure
- `index.html` - Main game file with core game loop
- `visual_effects.js` - Rendering engine and visual effects
- `sound.js` - Audio system and sound effects
- `level_config.js` - Level definitions and configurations
- `high_scores.js` - High score management
- `styles.css` - Game styling and UI

### Key Systems
- **Game Loop**: Main update/render cycle in `index.html`
- **Entity System**: Player, enemies, bullets management
- **Collision Detection**: Rectangular and circular collision
- **Spawn System**: Time-based enemy spawning
- **Audio Engine**: Web Audio API sound generation
- **Visual Engine**: Canvas rendering with effects

## 🎯 Contribution Areas

### High Priority
- [ ] Performance optimizations
- [ ] Mobile touch controls
- [ ] Additional enemy types
- [ ] Power-up systems
- [ ] Boss battles

### Medium Priority
- [ ] Enhanced visual effects
- [ ] New level designs
- [ ] Achievement system
- [ ] Improved UI/UX
- [ ] Accessibility features

### Nice to Have
- [ ] Multiplayer support
- [ ] Level editor
- [ ] WebGL renderer
- [ ] Replay system
- [ ] Custom control mapping

## 🔧 Adding New Features

### New Enemy Types
1. Add configuration to `enemyBaseConfig` in main game file
2. Update `visual_effects.js` for rendering
3. Add level spawn configurations in `level_config.js`
4. Test collision detection and behaviors

### New Levels
1. Add level configuration to `level_config.js`
2. Define enemy spawn patterns and timing
3. Set difficulty parameters
4. Test progression and balance

### Visual Effects
1. Extend `visual_effects.js`
2. Maintain 60 FPS performance
3. Consider visual clarity for gameplay
4. Add configuration options where appropriate

### Audio Features
1. Extend `sound.js` with new sound generators
2. Use Web Audio API for consistency
3. Provide volume controls
4. Consider audio accessibility

## 🐛 Debug Mode

Enable debug mode by pressing 'D' during gameplay:
- Level teleportation: `j + level_number + Enter`
- Real-time statistics display
- Performance monitoring
- Collision visualization

## 📚 Resources

### Documentation
- [HTML5 Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [JavaScript Game Development](https://developer.mozilla.org/en-US/docs/Games)

### Tools
- Browser DevTools for debugging
- Performance profiler for optimization
- Network tab for asset loading analysis

## 🤝 Community Guidelines

- Be respectful and constructive
- Help others learn and improve
- Share knowledge and resources
- Follow the code of conduct
- Give credit where due

## 📞 Getting Help

- Open an issue for questions
- Join discussions in existing issues
- Check documentation first
- Provide context when asking for help

## 🎮 Testing Checklist

Before submitting a PR, ensure:
- [ ] Game runs without console errors
- [ ] All controls work as expected
- [ ] Performance remains stable (60 FPS)
- [ ] High score system functions correctly
- [ ] Audio plays correctly
- [ ] Visual effects render properly
- [ ] Mobile compatibility maintained
- [ ] Code follows style guidelines

Thank you for contributing to Stellar Defense! 🚀✨ 