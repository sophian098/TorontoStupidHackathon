# Deploying Text Wrecker to Vercel

This guide will walk you through deploying your Text Wrecker app to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free tier works!)
2. [Vercel CLI](https://vercel.com/docs/cli) installed (optional, but recommended)
3. Your Gemini API key

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add Vercel deployment configuration"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Add Environment Variables**:
   - In the Vercel project settings, go to "Environment Variables"
   - Add your API key with one of these names:
     - `GEMINI_API_KEY` or
     - `GOOGLE_API_KEY` or
     - `GOOGLE_GENAI_API_KEY`
   - Value: Your actual Gemini API key
   - Select: "Production", "Preview", and "Development"
   - Click "Save"

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (usually 1-2 minutes)
   - Your app will be live at `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Set Environment Variables**:
   ```bash
   vercel env add GEMINI_API_KEY production
   # Paste your API key when prompted
   
   vercel env add GEMINI_API_KEY preview
   # Paste your API key again
   ```

4. **Deploy**:
   ```bash
   vercel --prod
   ```

5. **Follow the prompts**:
   - Link to existing project or create new one
   - Confirm settings
   - Wait for deployment

## What Was Changed for Vercel?

The following files were added/modified to support Vercel deployment:

1. **`vercel.json`** - Vercel configuration file
   - Specifies build command and output directory
   - Sets up API route rewrites

2. **`api/index.py`** - Serverless function wrapper
   - Adapts your Flask backend to work as a Vercel serverless function
   - All `/api/*` routes go through this

3. **`requirements.txt`** (root) - Python dependencies
   - Vercel needs this at the root to install Python packages

4. **`.vercelignore`** - Files to exclude from deployment
   - Keeps deployment lean and fast

## Testing Your Deployment

After deployment:

1. Visit your Vercel URL
2. Try selecting a persona and "wrecking" some text
3. Check that the meme generation works
4. Test the "Should I Send It?" advice feature

## Troubleshooting

### Build Fails

- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `frontend/package.json`
- Verify `requirements.txt` has all Python dependencies

### API Routes Not Working

- Verify environment variables are set correctly
- Check the API key name matches what's in `backend/app.py`
- Look at Function logs in Vercel dashboard

### Frontend Shows But API Fails

- The most common issue is missing environment variables
- Go to Project Settings → Environment Variables
- Add your `GEMINI_API_KEY` or `GOOGLE_API_KEY`
- Redeploy the project

## Local Development vs Production

- **Local**: Uses Vite dev server with proxy to Flask (port 5000)
- **Production**: Frontend served statically, backend as serverless functions

Both configurations work seamlessly without code changes!

## Custom Domain (Optional)

To add a custom domain:

1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

## Cost Considerations

Vercel's **free tier** includes:
- Unlimited deployments
- 100GB bandwidth per month
- Serverless function executions
- Automatic HTTPS
- Global CDN

The Gemini API also has a generous free tier. Perfect for hackathon projects!

---

🎉 **That's it!** Your Text Wrecker is now live on Vercel!
