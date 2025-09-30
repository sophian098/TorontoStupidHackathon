# GEMINI AI Setup Guide

## Changes Made

The app has been updated to **ONLY use GEMINI AI** for text transformations. The local text replacement functions have been removed.

### Frontend Changes (`frontend/src/App.jsx`)
- ✅ Removed all local text replacement functions (wreckCorporateRobot, wreckPassiveAggressive, etc.)
- ✅ Updated `handleWreck()` to only call the backend GEMINI API
- ✅ Added clear error messages when GEMINI API is unavailable
- ✅ Shows "Generating with GEMINI AI..." while processing

### Backend Already Configured
- ✅ `backend/app.py` uses Google Gemini API via `google-genai` library
- ✅ `/api/wreck` endpoint handles persona-based text transformation
- ✅ Persona prompts loaded from `backend/personas/*.txt` files
- ✅ Uses `gemini-2.5-flash` model

## Setup Instructions

### 1. Get Your GEMINI API Key
1. Visit https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 2. Configure Environment Variables

#### For Local Development:
Create `backend/.env` file:
```bash
GEMINI_API_KEY=your_actual_api_key_here
```

#### For Vercel Deployment:
Add environment variable in Vercel dashboard:
- Go to your project settings
- Navigate to "Environment Variables"
- Add: `GEMINI_API_KEY` = `your_actual_api_key_here`

### 3. Verify Installation

```bash
# Install backend dependencies
cd backend
pip install -r requirements.txt

# Start the backend server
python app.py
```

Backend should start on http://localhost:5000

### 4. Test the API

```bash
# Test the wreck endpoint
curl -X POST http://localhost:5000/api/wreck \
  -H "Content-Type: application/json" \
  -d '{"persona":"Corporate Robot","text":"I need to talk about this problem"}'
```

Expected response:
```json
{
  "output": "I need to circle back to touch base about this opportunity"
}
```

### 5. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

## Troubleshooting

### Error: "Unable to connect to GEMINI AI"
- ✅ Check that backend server is running (http://localhost:5000)
- ✅ Verify `GEMINI_API_KEY` is set in backend/.env
- ✅ Check API key is valid at https://aistudio.google.com
- ✅ Ensure `google-genai>=0.1.0` is installed

### Error: "AI not configured" (501)
- ✅ Check that environment variable is named correctly (`GEMINI_API_KEY`, `GOOGLE_API_KEY`, or `GOOGLE_GENAI_API_KEY`)
- ✅ Restart the backend server after adding environment variables

### Frontend Shows "Generating..." Forever
- ✅ Check browser console for fetch errors
- ✅ Verify CORS is not blocking requests
- ✅ Check that `VITE_API_URL` environment variable is set correctly (for production)

## Environment Variables Reference

### Backend accepts any of these names (in priority order):
1. `GEMINI_API_KEY` (legacy)
2. `GOOGLE_API_KEY` (recommended)
3. `GOOGLE_GENAI_API_KEY`
4. `GENAI_API_KEY`

### Frontend accepts:
- `VITE_API_URL` - Base URL for API calls (empty for local dev, set for production)

## Production Deployment

The app is configured for Vercel deployment:
- `vercel.json` routes all API requests to `api/index.py`
- `api/index.py` imports the Flask app from `backend/app.py`
- Set `GEMINI_API_KEY` in Vercel environment variables
- Frontend will automatically use relative API paths in production
