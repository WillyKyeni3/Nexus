from flask import Flask, session
from flask_migrate import Migrate
from flask_cors import CORS
from flask_login import LoginManager
from Models import db, User
from Routes.vote_routes import votes_bp

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key'  # for session management

CORS(app)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Initialize database and migrations
db.init_app(app)
migrate = Migrate(app, db)

# Register blueprints
app.register_blueprint(votes_bp)

# Test route
@app.route('/test')
def test_route():
    return {"message": "Server is running!"}, 200

if __name__ == '__main__':
    app.run(port=5555, debug=True)
