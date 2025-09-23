from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from flask_login import LoginManager
from Models import db
from Routes.vote_routes import votes_bp

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)

# Initialize database and migrations
db.init_app(app)
migrate = Migrate(app, db)

# Register blueprints
app.register_blueprint(votes_bp)

if __name__ == '__main__':
    app.run(port=5555, debug=True)
