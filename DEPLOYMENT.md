# Deployment Guide for Stellar Defense

## 🚀 GitHub Pages Deployment

This repository is configured for automatic deployment to GitHub Pages.

### Setup Instructions

1. **Enable GitHub Pages in your repository:**
   - Go to repository Settings > Pages
   - Source: "GitHub Actions"
   - The game will be automatically deployed on every push to master branch

2. **Access your deployed game:**
   - URL: `https://mike4330.github.io/stellardefense/`
   - The game will be available at the repository's GitHub Pages URL

### Manual Deployment

If you prefer manual deployment or want to deploy elsewhere:

#### Local Development Server
```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Using PHP (if available)
php -S localhost:8000
```

#### Static Hosting Services

**Netlify:**
1. Fork/clone the repository
2. Connect your GitHub account to Netlify
3. Deploy from the master branch
4. Set publish directory to root (`/`)

**Vercel:**
1. Import the repository to Vercel
2. No build configuration needed
3. Deploy from master branch

**GitHub Pages (Manual):**
1. Go to Settings > Pages
2. Source: Deploy from a branch
3. Branch: master
4. Folder: / (root)

## 🔧 Build Configuration

This is a static HTML5 game with no build process required. All files are served directly:

- `index.html` - Main game entry point
- `*.js` - Game modules and systems
- `*.css` - Styling
- `*.png` - Game assets (if any)

## 🌐 Custom Domain

To use a custom domain with GitHub Pages:

1. Add a `CNAME` file to the repository root with your domain
2. Configure DNS records at your domain provider
3. Enable HTTPS in GitHub Pages settings

Example CNAME file:
```
stellardefense.yourdomain.com
```

## 📊 Analytics & Monitoring

Consider adding:
- Google Analytics for usage tracking
- Error monitoring (e.g., Sentry)
- Performance monitoring
- User feedback collection

## 🔒 Security Headers

For production deployment, consider adding security headers:

```nginx
# Nginx example
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self'" always;
```

## 🚨 Troubleshooting

**Game not loading:**
- Check browser console for errors
- Verify all file paths are correct
- Ensure HTTPS is enabled for Web Audio API

**Performance issues:**
- Monitor browser DevTools Performance tab
- Check for memory leaks in long gaming sessions
- Optimize images and assets

**Audio not working:**
- Web Audio API requires user interaction
- Check browser audio permissions
- Verify autoplay policies

## 📱 Mobile Considerations

For better mobile experience:
- Test on various devices and screen sizes
- Consider touch controls implementation
- Optimize for mobile browsers
- Test performance on lower-end devices

---

For more deployment options or issues, please open an issue in the repository! 