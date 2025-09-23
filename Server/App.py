#!/usr/bin/env python3

from flask import Flask, request
from flask_restful import Resource
from flask_migrate import Migrate
from flask_cors import CORS
from flask_login import LoginManager

# Local imports
from Models import db, Project, User, Cohort
from Routes import project_routes, auth_routes
from Routes.vote_routes import votes_bp

# Initialize app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Setup extensions
CORS(app)
db.init_app(app)
migrate = Migrate(app, db)
login_manager = LoginManager(app)

# Register blueprints / routes
app.register_blueprint(votes_bp)
# If project_routes and auth_routes are blueprints, register them too
# app.register_blueprint(project_routes)
# app.register_blueprint(auth_routes)

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

if __name__ == '__main__':
    app.run(port=5555, debug=True)
