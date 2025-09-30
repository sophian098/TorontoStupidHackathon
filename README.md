# Text Wrecker

Single-page app that "wrecks" user text with funny persona-based replacements. Built for hackathon meme-ability.

## ✨ Features

- Persona-based transformations:
  - Corporate Robot
  - Passive-Aggressive Nightmare
  - Shakespearean Drama King
- One-click chaos: confirm, wreck, meme, sound, copy
- Safe text rendering (no `innerHTML`)
- Accessible controls and visible labels
- Early-2000s cursed aesthetic: Comic Neue, hot pink, flashing header, tiled bg

## 🧭 How it works

1. Type in the input.
2. Pick a personality from the select.
3. Click "Wreck" and confirm the chaos prompt.
4. Your transformed text appears; a random meme image swaps in.
5. Click "Copy" to put the output on your clipboard.

Core UI elements (IDs/classes used in the DOM):
- `.flashing-text`
- `#personalitySelect`
- `#userInput`
- `#wreckButton`
- `#output`
- `#copyButton`
- `#memeImage`
- `#errorSound`

## 🗂 Project layout

```
TorontoStupidHackathon/
  backend/
    app.py
    personas/
      corporate_robot.txt
      passive_aggressive_nightmare.txt
      shakespearean_drama_king.txt
      ...
    requirements.txt
  frontend/
    index.html
    vite.config.js
    package.json
    src/
      main.jsx
      App.jsx
      index.css
      assets/
```

## 🛠 Tech stack

- Frontend: React + Vite
- Fonts: Google Fonts "Comic Neue"
- Assets: external meme images and audio URLs (no local hosting required)

## 🚀 Quick start

Prereqs:
- Node.js 18+ and npm

Frontend (dev):
```bash
cd frontend
npm install
npm run dev
```
- Open the URL printed by Vite (usually `http://localhost:5173`).

Frontend (production build + preview):
```bash
cd frontend
npm run build
npm run preview
```

Optional backend (demo API):
Prereqs: Python 3.10+ (or any recent 3.x)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## 🧩 Behavior details

- On `#wreckButton`:
  - Plays `#errorSound`
  - Asks: "Are you SURE you want to introduce this level of chaos into your life?"
  - If confirmed: transforms text per selected personality, updates `#output`, swaps `#memeImage` URL
- On `#copyButton`:
  - Copies `#output` text via `navigator.clipboard.writeText` (fallback no-op if unavailable)
  - Temporarily shows "Copied!" ~2s, then reverts

## 🧠 Transformations

Three transformation functions implement robust, case-insensitive phrase replacements that avoid breaking punctuation:
- Corporate Robot
- Passive-Aggressive Nightmare
- Shakespearean Drama King

These live in the frontend app code and run purely client-side.

## 🔒 Security and ♿ Accessibility

- Never uses `innerHTML` to render user input
- Focusable buttons and labeled controls
- High-contrast, readable text with large hit targets

## 🧪 Development notes

- Keep code readable; avoid minification or dense one-liners
- Keep images/audio as external URLs
- Use the specified IDs/classes consistently to avoid breaking UI hooks

## 📄 License

MIT (or your preferred license)
