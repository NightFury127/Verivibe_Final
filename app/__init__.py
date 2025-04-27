from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configure the Flask application
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev')
    
    # Initialize extensions with app
    CORS(app)
    
    # Register blueprints
    from app.api.routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api/v1')
    
    return app 