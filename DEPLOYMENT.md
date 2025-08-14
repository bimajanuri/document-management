# ManaDoc - Cloudflare Pages Deployment Guide

## 📋 Prerequisites

1. **Cloudflare Account**: Create a free account at [cloudflare.com](https://cloudflare.com)
2. **Node.js**: Version 18+ (recommended: 20+)
3. **Git Repository**: Code should be in a Git repository

## 🚀 Deployment Options

### Option 1: Automatic Deployment via Git Integration (Recommended)

1. **Connect Repository to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to `Pages` → `Create a project`
   - Select `Connect to Git`
   - Choose your repository: `document-management`

2. **Configure Build Settings:**
   ```
   Framework preset: Vite
   Build command: npm run build
   Build output directory: dist
   Root directory: / (leave empty)
   Node.js version: 20
   Environment variables: (none required for basic setup)
   ```

   **⚠️ Important:** Make sure to set the build command to `npm run build` (NOT `npx wrangler deploy`)

3. **Deploy:**
   - Click `Save and Deploy`
   - Cloudflare will automatically build and deploy your site
   - Every push to `master` branch will trigger automatic redeployment

### Option 2: Manual Deployment via Wrangler CLI

**⚠️ Important:** Use Git integration (Option 1) for Cloudflare Pages. Manual deployment is for advanced users only.

1. **Login to Cloudflare:**
   ```bash
   npm run cf:login
   ```

2. **Verify Login:**
   ```bash
   npm run cf:whoami
   ```

3. **Create Pages Project (first time only):**
   ```bash
   npm run cf:pages:create
   ```

4. **Deploy to Production:**
   ```bash
   npm run deploy
   ```

5. **Deploy Preview (for testing):**
   ```bash
   npm run deploy:preview
   ```

## 🔧 Configuration Files

### wrangler.toml
Main configuration file for Cloudflare Pages deployment settings.

### public/_redirects
Handles SPA routing for React Router - ensures all routes work correctly.

### package.json Scripts
- `deploy`: Build and deploy to production
- `deploy:preview`: Build and deploy to preview environment
- `cf:login`: Login to Cloudflare
- `cf:whoami`: Check current login status
- `cf:pages:list`: List all Pages projects
- `cf:pages:create`: Create new Pages project

## 🌐 Environment Variables (Optional)

If you need environment variables, add them in Cloudflare Dashboard:

1. Go to your Pages project
2. Navigate to `Settings` → `Environment variables`
3. Add variables like:
   ```
   VITE_API_URL = https://your-api-url.com
   VITE_APP_ENV = production
   ```

## 🔒 Security Headers

The deployment includes security headers:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

## 📱 Custom Domain (Optional)

1. Go to your Pages project in Cloudflare Dashboard
2. Navigate to `Custom domains`
3. Click `Set up a custom domain`
4. Follow the DNS configuration instructions

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (should be 20+)
- Ensure all dependencies are installed: `npm install`
- Test local build: `npm run build`
- **Common Issue:** Make sure build command in Cloudflare Dashboard is `npm run build` (NOT `npx wrangler deploy`)

### "Directory does not exist" Error
This happens when Cloudflare tries to run `wrangler deploy` instead of building first:
1. Go to your Pages project settings
2. Change build command from `npx wrangler deploy` to `npm run build`
3. Set build output directory to `dist`
4. Redeploy

### Routing Issues
- Verify `_redirects` file is in `public/` directory
- Check that all routes are properly configured in `App.tsx`

### Authentication Issues
- Remember that localStorage is used for auth
- Users will need to login again after deployment

### Wrangler Configuration Issues
- The `wrangler.toml` file is for manual deployment only
- Cloudflare Pages uses dashboard build settings, not wrangler.toml
- If you see wrangler errors, use Git integration instead of manual deployment

## 📊 Performance

Cloudflare Pages provides:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Fast builds
- ✅ Unlimited bandwidth
- ✅ Preview deployments
- ✅ Git integration

## 🔄 Continuous Deployment

With Git integration:
1. Push code to `master` branch
2. Cloudflare automatically builds and deploys
3. Changes are live in ~2-3 minutes
4. Preview deployments for pull requests

## 📝 Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All routes work (test navigation)
- [ ] Authentication flow works
- [ ] Dark mode toggle functions
- [ ] Tables and forms work properly
- [ ] Mobile responsiveness
- [ ] Custom domain configured (if needed)

## 📞 Support

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [React Router Deployment Guide](https://reactrouter.com/en/main/guides/deploying)
