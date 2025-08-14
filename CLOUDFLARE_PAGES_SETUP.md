# 🚀 Cloudflare Pages Setup Guide

## ❗ IMPORTANT: Build Configuration

The deployment error you're seeing happens because Cloudflare Pages is using the wrong build command. Follow these steps exactly:

## 📋 Step-by-Step Setup

### 1. Go to Cloudflare Dashboard
- Visit [dash.cloudflare.com](https://dash.cloudflare.com)
- Login to your account
- Navigate to **Pages** in the left sidebar

### 2. Create New Project
- Click **"Create a project"**
- Select **"Connect to Git"**
- Choose **GitHub** as your Git provider
- Select repository: **`bimajanuri/document-management`**

### 3. Configure Build Settings (CRITICAL)

**Framework preset:** `Vite`

**Build command:** 
```
npm run build
```
**❌ DO NOT USE:** `npx wrangler deploy`

**Build output directory:**
```
dist
```

**Root directory:** 
```
(leave empty or use "/")
```

**Environment variables:**
```
(none required - leave empty)
```

**Node.js version:**
```
20
```

### 4. Deploy
- Click **"Save and Deploy"**
- Wait for build to complete (~2-3 minutes)
- Your site will be live at `https://[project-name].pages.dev`

## 🔧 If You Already Created the Project

If you already have a Pages project with wrong settings:

1. Go to your Pages project
2. Click **"Settings"** tab
3. Scroll to **"Build and deployments"**
4. Click **"Edit"** next to build configuration
5. Change build command to: `npm run build`
6. Change build output directory to: `dist`
7. Click **"Save"**
8. Go to **"Deployments"** tab
9. Click **"Retry deployment"** on the latest failed deployment

## ✅ Correct Build Settings Summary

```yaml
Framework: Vite
Build Command: npm run build
Build Output: dist
Root Directory: /
Node Version: 20
Environment Variables: (none)
```

## 🚫 Common Mistakes to Avoid

❌ **Wrong build command:** `npx wrangler deploy`  
✅ **Correct build command:** `npm run build`

❌ **Wrong output directory:** `build`  
✅ **Correct output directory:** `dist`

❌ **Using wrangler.toml for Pages**  
✅ **Using dashboard build settings**

## 🎯 Why This Happens

- Cloudflare Pages and Cloudflare Workers use different deployment methods
- Pages builds static sites and serves them via CDN
- Workers run JavaScript at the edge
- Our project is a static React app, so we need Pages (not Workers)
- The `wrangler.toml` file is only for manual deployment, not automatic Pages deployment

## 📞 Need Help?

If deployment still fails:
1. Check the build logs in Cloudflare Pages dashboard
2. Ensure your repository has the latest code
3. Try a fresh deployment
4. Contact support with the specific error message

## 🎉 Success Indicators

When deployment works correctly, you'll see:
- ✅ Build completes successfully
- ✅ Site is accessible at your Pages URL
- ✅ All routes work (signin, dashboard, etc.)
- ✅ Authentication flow functions properly
- ✅ Dark mode toggle works
- ✅ All pages render correctly
