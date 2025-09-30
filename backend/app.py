from flask import Flask, jsonify, request
import os
import random
import urllib.parse
import typing as t

try:
    # New Gemini client per https://ai.google.dev/gemini-api/docs
    from google import genai  # type: ignore
except Exception:  # pragma: no cover - library optional at runtime
    genai = None  # type: ignore


def create_app() -> Flask:
    app = Flask(__name__)
    # Load environment variables from backend/.env or project root .env if present
    try:
        from dotenv import load_dotenv  # type: ignore

        # Prefer backend/.env, fall back to repo root
        backend_env_path = os.path.join(os.path.dirname(__file__), ".env")
        if os.path.exists(backend_env_path):
            load_dotenv(backend_env_path)
        else:
            load_dotenv()
    except Exception:
        pass

    @app.get("/health")
    def health() -> tuple:
        return jsonify(status="ok"), 200

    @app.get("/")
    def index() -> tuple:
        return jsonify(service="The Summer I turned Petty Backend", status="ok"), 200

    def load_persona_prompts() -> t.Dict[str, str]:
        """Load persona prompt text from backend/personas/*.txt files.

        File names are mapped explicitly to persona display names for stability.
        An optional env var PERSONA_PROMPTS_DIR can override the directory.
        """
        base_dir = os.getenv("PERSONA_PROMPTS_DIR") or os.path.join(
            os.path.dirname(__file__), "personas"
        )
        filename_by_persona: t.Dict[str, str] = {
            "Corporate Robot": "corporate_robot.txt",
            "Passive-Aggressive Nightmare": "passive_aggressive_nightmare.txt",
            "Shakespearean Drama King": "shakespearean_drama_king.txt",
            "Teen Angst Poet": "teen_angst_poet.txt",
            "Belly": "belly.txt",
            "Jeremiah": "jeremiah.txt",
            "Conrad": "conrad.txt",
        }
        prompts: t.Dict[str, str] = {}
        for persona, filename in filename_by_persona.items():
            try:
                path = os.path.join(base_dir, filename)
                with open(path, "r", encoding="utf-8") as f:
                    prompts[persona] = f.read().strip()
            except Exception:
                # Missing file is acceptable; we'll fall back later
                pass
        return prompts

    def get_api_key() -> str:
        """Return the configured Gemini API key.

        Supports several common env var names to reduce setup friction.
        Priority order:
        - GEMINI_API_KEY (legacy)
        - GOOGLE_API_KEY (per docs)
        - GOOGLE_GENAI_API_KEY
        - GENAI_API_KEY
        """
        return (
            os.getenv("GEMINI_API_KEY")
            or os.getenv("GOOGLE_API_KEY")
            or os.getenv("GOOGLE_GENAI_API_KEY")
            or os.getenv("GENAI_API_KEY")
            or ""
        )

    def get_model_candidates() -> t.List[str]:
        """Return preferred Gemini model IDs in priority order.

        Based on docs: prefer stable 2.5 Flash, then the latest Flash alias,
        then 2.0 Flash stable variants, and finally experimental as a last resort.
        Allows override via env var GEMINI_MODEL (comma-separated list).
        See https://ai.google.dev/gemini-api/docs/models
        """
        override = os.getenv("GEMINI_MODEL")
        if override:
            return [m.strip() for m in override.split(",") if m.strip()]

        return [
            # Stable tier
            "gemini-2.5-flash",
            # Latest alias (may point to preview/stable depending on release cadence)
            "gemini-flash-latest",
            # Previous generation stable options
            "gemini-2.0-flash",
            "gemini-2.0-flash-001",
            # Experimental fallback when others are temporarily unavailable
            "gemini-2.0-flash-exp",
        ]

    def generate_with_fallback(client: "genai.Client", contents: str) -> str:
        """Attempt text generation across multiple models until one succeeds.

        Returns the response.text from the first successful call or raises the
        last encountered exception if all candidates fail.
        """
        last_error: t.Optional[Exception] = None
        for model in get_model_candidates():
            try:
                response = client.models.generate_content(model=model, contents=contents)
                output_text = (getattr(response, "text", "") or "").strip()
                if output_text:
                    return output_text
                # If empty, try next model
                last_error = RuntimeError("Empty response from model: %s" % model)
            except Exception as exc:  # pragma: no cover - network/service dependent
                # Capture and try the next candidate
                last_error = exc
                continue
        # Exhausted candidates
        if last_error is not None:
            raise last_error
        raise RuntimeError("No models attempted")

    @app.post("/api/wreck")
    def wreck_api() -> tuple:
        """Rewrite text using Gemini based on a selected persona.

        Request JSON: { "persona": str, "text": str }
        Response JSON: { "output": str }
        """
        data: t.Dict[str, t.Any] = request.get_json(silent=True) or {}
        persona: str = (data.get("persona") or "").strip()
        text: str = (data.get("text") or "").strip()

        if not text:
            return jsonify(error="Missing 'text'"), 400

        api_key = get_api_key()
        if not api_key or genai is None:
            return jsonify(error="AI not configured"), 501

        try:
            # Initialize client explicitly with API key for portability
            client = genai.Client(api_key=api_key)

            system_instructions = (
                "You are 'The Summer I turned Petty'. Rewrite the user's text in the requested persona. "
                "Keep core meaning but change tone. Preserve punctuation and formatting. "
                "Do NOT add prefatory text or commentary. Return only the rewritten text."
            )

            persona_instructions = load_persona_prompts()

            persona_hint = persona_instructions.get(
                persona, "Mild stylistic rewrite with humorous tone."
            )

            prompt = (
                f"Persona: {persona or 'Unspecified'}\n"
                f"Style hints: {persona_hint}\n\n"
                f"Text to rewrite:\n{text}"
            )

            # Generate with model fallback
            combined_contents = (
                f"{system_instructions}\n\n"
                f"Persona: {persona or 'Unspecified'}\n"
                f"Style hints: {persona_hint}\n\n"
                f"Text to rewrite:\n{text}"
            )
            output_text = generate_with_fallback(client, combined_contents)
            return jsonify(output=output_text), 200
        except Exception as exc:  # pragma: no cover - network/service dependent
            return jsonify(error=str(exc)), 502

    @app.post("/api/advice")
    def advice_api() -> tuple:
        """Generate chaotic post-copy advice for the user's message.

        Request JSON: { "text": str }
        Response JSON: { "advice": str }
        """
        data: t.Dict[str, t.Any] = request.get_json(silent=True) or {}
        text: str = (data.get("text") or "").strip()

        # Always have a funny fallback, even if no text was provided
        fallback_advices = [
            "100% send it. What's the worst that could happen?",
            "They need to hear this. DO IT.",
            "Hit send now. Future you can apologize later.",
            "Absolutely send it. Clarity via chaos!",
            "Yes. Send. Consequences are just tomorrow's mini-boss.",
        ]

        api_key = get_api_key()
        if not api_key or genai is None:
            return jsonify(advice=fallback_advices[0]), 200

        try:
            client = genai.Client(api_key=api_key)

            system_instructions = (
                "You are 'Should I Send It?' from a Stupid Hackathon. "
                "Your job is to provide hilariously bad, chaos-inducing encouragement for sending risky texts. "
                "Return ONE short punchy line (12-24 words). Be confident, reckless, and funny. "
                "Avoid disclaimers, hedging, or analysis. Do not add emojis. Output ONLY the line."
            )

            idea_context = (
                "This targets a 'Most Breakup Worthy' vibe. Regardless of input, you almost always advise sending."
            )

            prompt = (
                f"{system_instructions}\n\n"
                f"Context: {idea_context}\n\n"
                f"User message (optional):\n{text if text else '[no message provided]'}\n\n"
                "Now produce the one-line chaotic encouragement."
            )

            advice_text = generate_with_fallback(client, prompt)
            if not advice_text:
                advice_text = fallback_advices[1]

            return jsonify(advice=advice_text), 200
        except Exception as exc:  # pragma: no cover
            return jsonify(advice=fallback_advices[2], error=str(exc)), 200

    @app.post("/api/meme")
    def meme_api() -> tuple:
        """Return a simple meme image URL related to the provided text.

        Strategy:
        - If Gemini is configured, ask it to generate short TOP and BOTTOM captions.
        - Compose a memegen.link URL with those captions and a background image.
        - If Gemini isn't configured or parsing fails, fall back to generic captions.

        Request JSON: { "text": str }
        Response JSON: { "url": str }
        """
        data: t.Dict[str, t.Any] = request.get_json(silent=True) or {}
        text: str = (data.get("text") or "").strip()

        # Choose a fun background that is stable and hotlink-friendly
        backgrounds = [
            "https://picsum.photos/seed/wrecker-bg1/640/420",
            "https://picsum.photos/seed/wrecker-bg2/640/420",
            "https://placekitten.com/640/420",
            "https://picsum.photos/seed/wrecker-bg3/600/400",
        ]
        bg_url = random.choice(backgrounds)

        top_caption = "SEND IT"
        bottom_caption = "what's the worst?"

        api_key = get_api_key()
        if api_key and genai is not None:
            try:
                client = genai.Client(api_key=api_key)
                system_instructions = (
                    "Generate meme captions. Return two ultra-short lines ONLY in this strict format: "
                    "TOP: <max 6 words>\nBOTTOM: <max 7 words>. "
                    "Be chaotic but humorous; avoid profanity and slurs."
                )
                prompt = (
                    f"{system_instructions}\n\n"
                    f"Text: {text or '[no text provided]'}\n"
                    "Keep it breakup/messy-text themed."
                )
                raw = generate_with_fallback(client, prompt)
                # Parse the expected TOP/BOTTOM lines
                if raw:
                    lines = [ln.strip() for ln in raw.splitlines() if ln.strip()]
                    for ln in lines:
                        up = ln.upper()
                        if up.startswith("TOP:"):
                            top_caption = ln.split(":", 1)[1].strip() or top_caption
                        elif up.startswith("BOTTOM:"):
                            bottom_caption = ln.split(":", 1)[1].strip() or bottom_caption
            except Exception:
                # Soft-fail to fallback captions
                pass

        # Build memegen url with custom background
        # See https://api.memegen.link/
        def encode_segment(s: str) -> str:
            # memegen expects special escaping for / _ - ?
            # Use urllib.quote and then replace spaces with '_'
            s = s.replace("-", "--")
            s = s.replace("_", "__")
            s = s.replace(" ", "_")
            s = s.replace("?", "~q").replace("%", "~p").replace("#", "~h").replace("/", "~s")
            return s

        top_seg = encode_segment(top_caption) or "_"
        bottom_seg = encode_segment(bottom_caption) or "_"
        bg_param = urllib.parse.quote_plus(bg_url)
        meme_url = (
            f"https://api.memegen.link/images/custom/{top_seg}/{bottom_seg}.png?background={bg_param}"
        )

        return jsonify(url=meme_url), 200

    @app.after_request
    def add_cors_headers(response):
        """Allow the GitHub Pages origin (or any, if not configured) to call the API.

        Configure ALLOWED_ORIGIN in the environment for stricter control, e.g.
        https://<github-username>.github.io or your custom domain.
        """
        allowed_origin = os.getenv("ALLOWED_ORIGIN", "*")
        response.headers["Access-Control-Allow-Origin"] = allowed_origin
        response.headers["Vary"] = "Origin"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        return response

    @app.route("/api/<path:_preflight_only>", methods=["OPTIONS"])
    def cors_preflight(_preflight_only) -> tuple:
        """Generic preflight responder for all API endpoints."""
        return ("", 204)

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


