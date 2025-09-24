#!/usr/bin/env python3

# Remote library imports
from flask import request
from flask_restful import Resource
from flask_cors import CORS
from flask_login import LoginManager

# Local imports
from Config import app, db, api   # central config
from Models import Project, User, Cohort, Vote
from Routes import project_routes, auth_routes, corhot_routes
from Routes.vote_routes import votes_bp

# Setup extensions
CORS(app)
login_manager = LoginManager(app)

# Register blueprints / routes
app.register_blueprint(votes_bp)

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

if __name__ == '__main__':
    app.run(port=5555, debug=True)
