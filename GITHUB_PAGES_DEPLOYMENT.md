# Deploying to GitHub Pages

Your app is now configured for a split deployment:
- **Backend**: Vercel (serverless functions)
- **Frontend**: GitHub Pages (static hosting)

## 📋 Prerequisites

1. GitHub account with this repository
2. Vercel account (free tier)
3. Gemini API key from Google AI Studio

## 🚀 Step-by-Step Deployment

### Part 1: Deploy Backend to Vercel

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages + Vercel deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select `sophian098/TorontoStupidHackathon`
   - Vercel will detect the configuration from `vercel.json`
   - Click "Deploy"

3. **Add Environment Variable**:
   - In Vercel dashboard, go to: Project Settings → Environment Variables
   - Add variable:
     - **Name**: `GOOGLE_API_KEY`
     - **Value**: Your Gemini API key
     - **Environments**: Production, Preview, Development
   - Click "Save"
   - Redeploy if needed

4. **Copy your Vercel URL**:
   - After deployment, you'll get a URL like: `https://toronto-stupid-hackathon.vercel.app`
   - **Save this URL** - you'll need it in the next step!

### Part 2: Configure Frontend for GitHub Pages

1. **Update the API URL**:
   
   Create `frontend/.env.production` file:
   ```bash
   VITE_API_URL=https://your-actual-vercel-url.vercel.app
   ```
   
   Replace `your-actual-vercel-url.vercel.app` with your real Vercel URL from Part 1.

2. **Commit the change**:
   ```bash
   git add frontend/.env.production
   git commit -m "Add production API URL"
   git push origin main
   ```

### Part 3: Enable GitHub Pages

1. **Go to your GitHub repository**:
   - Navigate to: `https://github.com/sophian098/TorontoStupidHackathon`

2. **Enable GitHub Pages**:
   - Go to: Settings → Pages
   - Under "Source", select: **GitHub Actions**
   - Click "Save"

3. **Trigger deployment**:
   - The GitHub Action will automatically run on the next push
   - Or manually trigger it: Actions tab → "Deploy to GitHub Pages" → "Run workflow"

4. **Wait for deployment**:
   - Go to the "Actions" tab to watch progress
   - Deployment usually takes 2-3 minutes
   - Once complete, your site will be live at:
     ```
     https://sophian098.github.io/TorontoStupidHackathon/
     ```

## ✅ Testing Your Deployment

1. Visit your GitHub Pages URL
2. Select a persona (e.g., "Shakespearean Drama King")
3. Enter some text
4. Click "Wreck It!"
5. Verify the AI transformation works (backend API)
6. Click "Copy Wreckage" to test the advice feature

## 🔧 What Changed?

### Files Modified:
1. **`frontend/vite.config.js`**: Added `base: '/TorontoStupidHackathon/'` for GitHub Pages routing
2. **`frontend/src/App.jsx`**: Updated API calls to use environment variable for backend URL
3. **`.github/workflows/deploy.yml`**: Created GitHub Actions workflow for auto-deployment

### Files Created:
1. **`frontend/.env.production`**: Production API URL configuration (you need to create this)

## 🎯 Local Development Still Works!

Your local development setup is unchanged:
```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

The proxy configuration in `vite.config.js` ensures local API calls go to `localhost:5000`.

## 🐛 Troubleshooting

### Frontend loads but API calls fail
- **Problem**: Wrong API URL or missing environment variable
- **Fix**: 
  1. Verify `frontend/.env.production` has the correct Vercel URL
  2. Commit and push the change
  3. GitHub Actions will auto-deploy

### GitHub Actions deployment fails
- **Problem**: Build error or permissions
- **Fix**:
  1. Check the Actions tab for error logs
  2. Ensure GitHub Pages is enabled with "GitHub Actions" source
  3. Verify `frontend/package.json` and dependencies are correct

### Vercel backend returns 501 errors
- **Problem**: Missing API key
- **Fix**:
  1. Go to Vercel Project Settings → Environment Variables
  2. Add `GOOGLE_API_KEY` with your Gemini key
  3. Redeploy the project

### Images or assets don't load
- **Problem**: Path issues with GitHub Pages base URL
- **Fix**: The `base: '/TorontoStupidHackathon/'` in vite.config.js should handle this automatically

## 🔄 Making Updates

After making code changes:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

- **Backend changes**: Auto-deploy to Vercel
- **Frontend changes**: Auto-deploy to GitHub Pages via GitHub Actions

## 📊 Monitoring

- **Vercel Dashboard**: Monitor backend performance, function logs, and errors
- **GitHub Actions**: View deployment history and build logs
- **Browser Console**: Check for frontend errors and API response issues

## 💰 Cost

Both platforms are **free** for this project:
- **Vercel Free Tier**: 100GB bandwidth, serverless functions included
- **GitHub Pages**: Unlimited static hosting for public repos
- **Gemini API**: Generous free tier for API calls

---

🎉 **You're all set!** Your app is now live with professional CI/CD deployment.
