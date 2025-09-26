from datetime import datetime, timezone
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from Config import db


class User(db.Model, SerializerMixin, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False, default="student")  # 'student' or 'mentor'
    cohort_id = db.Column(db.Integer, db.ForeignKey('cohorts.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    # Relationships
    projects = db.relationship('Project', back_populates='user', cascade="all, delete-orphan")
    votes = db.relationship('Vote', backref='mentor', lazy=True)
    cohort = db.relationship('Cohort', back_populates='users')

    # Serialization rules
    serialize_rules = ('-projects.user', '-cohort.users', '-votes.mentor')

    # Password helpers
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Cohort(db.Model, SerializerMixin):
    __tablename__ = 'cohorts'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

    # Relationships
    users = db.relationship('User', back_populates='cohort', cascade="all, delete-orphan")


class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    author_name = db.Column(db.String)
    cohort = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    # Relationships
    user = db.relationship('User', back_populates='projects')
    votes = db.relationship('Vote', backref='project', lazy=True)

    # Serialization rules
    serialize_rules = ('-user.projects', '-votes.project')

    @property
    def vote_status(self):
        if not self.votes:
            return "pending"
        # Return the status of the most recent vote
        return self.votes[-1].status if self.votes else "pending"
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    author_name = db.Column(db.String, nullable=False, default='Unknown Author')
    status = db.Column(db.String, default="pending")

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    # Relationships
    user = db.relationship('User', back_populates='projects')
    votes = db.relationship('Vote', backref='project', cascade='all, delete-orphan')

    # Serialization rules
    serialize_rules = ('-user.projects', '-votes.project')

    # Validations
    @validates('title')
    def validate_title(self, key, title):
        if not title or len(title) < 5:
            raise ValueError('Title must be at least 5 characters long')
        return title

    @validates('description')
    def validate_description(self, key, description):
        if not description:
            raise ValueError('Description is required')
        if len(description) < 50:
            raise ValueError('Description must be at least 50 characters long')
        if len(description) > 150:
            raise ValueError('Description cannot be more than 150 characters')
        return description

    def __repr__(self):
        return f'<Project {self.id} {self.title}>'


class Vote(db.Model, SerializerMixin):
    __tablename__ = 'votes'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String, nullable=False)  # 'approved' or 'declined'
    mentor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    # Serialization rules
    serialize_rules = ('-mentor.votes', '-project.votes')

    @validates('status')
    def validate_status(self, key, status):
        valid_statuses = ['approved', 'declined']
        if status not in valid_statuses:
            raise ValueError(f"Status must be one of: {', '.join(valid_statuses)}")
        return status
