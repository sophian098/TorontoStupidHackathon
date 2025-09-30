"""
Vercel serverless function wrapper for Flask backend.
"""
import sys
import os

# Add the backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), "..", "backend")
sys.path.insert(0, backend_path)

# Import and create the Flask app
from app import create_app

app = create_app()

# Vercel serverless entry point
# This will be called for all /api/* routes
def handler(environ, start_response):
    """WSGI handler for Vercel serverless functions"""
    return app(environ, start_response)
