# Quick Deploy Guide

## TL;DR

Your app needs TWO deployments:
1. **Backend** → Vercel (handles AI and APIs)
2. **Frontend** → GitHub Pages (static site)

## Fast Track Deployment

### 1️⃣ Deploy Backend to Vercel (5 minutes)

```bash
# Push to GitHub if needed
git push origin main
```

1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Import `sophian098/TorontoStupidHackathon`
3. Add environment variable:
   - Name: `GOOGLE_API_KEY`
   - Value: Your Gemini API key
4. Click **Deploy**
5. **Copy your Vercel URL** (e.g., `https://toronto-stupid-hackathon.vercel.app`)

### 2️⃣ Configure Frontend (2 minutes)

**Option A: Use the setup script** (recommended)
```bash
./setup-github-pages.sh https://your-vercel-url.vercel.app
```

**Option B: Manual setup**
Create `frontend/.env.production`:
```bash
VITE_API_URL=https://your-vercel-url.vercel.app
```

### 3️⃣ Push and Enable GitHub Pages (3 minutes)

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

Then:
1. Go to **Settings** → **Pages** in your GitHub repo
2. Source: Select **"GitHub Actions"**
3. Click **Save**

### 4️⃣ Done! 🎉

Your site will be live at:
```
https://sophian098.github.io/TorontoStupidHackathon/
```

Check deployment progress in the **Actions** tab.

## Testing

1. Visit your GitHub Pages URL
2. Select a persona
3. Enter text and click "Wreck It!"
4. Verify the AI works (means backend is connected!)

## Problems?

### API calls failing?
- Check `frontend/.env.production` has correct Vercel URL
- Verify Vercel environment variable `GOOGLE_API_KEY` is set
- Check browser console for errors

### GitHub Actions failing?
- Go to Settings → Pages → Ensure "GitHub Actions" is selected
- Check Actions tab for error logs

### Site not loading?
- Wait 2-3 minutes for first deployment
- Clear browser cache
- Check Actions tab to ensure deployment succeeded

## Full Documentation

See **[GITHUB_PAGES_DEPLOYMENT.md](./GITHUB_PAGES_DEPLOYMENT.md)** for complete guide.

---

**Architecture:**
```
User Browser
    ↓
GitHub Pages (Frontend: React/Vite)
    ↓ API calls
Vercel (Backend: Flask/Gemini)
    ↓ AI requests  
Google Gemini API
```

All set! 🚀
