from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SECRET_KEY'] = 'supersecretkey'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)


# ---------------- Models ---------------- #
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class Cohort(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    users = db.relationship('User', backref='cohort', lazy=True)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # student or mentor
    cohort_id = db.Column(db.Integer, db.ForeignKey('cohort.id'))


# ---------------- Routes ---------------- #
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_pw,
        role=data.get('role', 'student'),
        cohort_id=data.get('cohort_id')
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        login_user(user)
        return jsonify({"message": "Login successful"})
    return jsonify({"error": "Invalid credentials"}), 401


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out"})


@app.route('/users/<int:id>', methods=['GET'])
@login_required
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "cohort": user.cohort.name if user.cohort else None
    })


# ---------------- Run ---------------- #
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
