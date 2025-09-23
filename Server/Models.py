from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from flask_login import UserMixin
from datetime import datetime, timezone

db = SQLAlchemy()


class User(db.Model, SerializerMixin, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    role = db.Column(db.String, nullable=False)  # 'mentor' or 'student'
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    # Relationships
    projects = db.relationship('Project', backref='owner', lazy=True)
    votes = db.relationship('Vote', backref='mentor', lazy=True)

    # Serialization rules
    serialize_rules = ('-_password_hash', '-projects.owner', '-votes.mentor')


class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    author_name = db.Column(db.String, nullable=False, default='Unknown Author')
    status = db.Column(db.String, default="pending")

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    # Relationships
    votes = db.relationship('Vote', backref='project', cascade='all, delete-orphan')

    # Serialization rules
    serialize_rules = ('-owner.projects', '-votes.project')

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
