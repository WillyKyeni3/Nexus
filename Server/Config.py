# config.py

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

# Instantiate app
app = Flask(__name__)

# App configuration
import os

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'dev-secret-key-123'

# ✅ Cookie/session settings for localhost
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'   # works with localhost
app.config['SESSION_COOKIE_SECURE'] = False     # must be False unless using https
app.json.compact = False

# Define metadata and instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)

# Initialize migrations
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Enable CORS with credentials for all routes
CORS(
    app,
    supports_credentials=True,
    resources={r"/*": {
        "origins": [
            "http://localhost:5173"
            "nexus-seven-orcin.vercel.app"
        ]
    }},
)

# 🔑 Force credentials header (important for cookies)
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PATCH,DELETE,OPTIONS"
    return response

# Import models so Alembic can detect them
from Models import User, Project, Cohort, Vote
