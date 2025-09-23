from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime

db = SQLAlchemy()

from flask_login import UserMixin

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
    
    # Serialize rules
    serialize_rules = ('-_password_hash', '-projects.owner', '-votes.mentor')

class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    # Serialize rules
    serialize_rules = ('-owner.projects', '-votes.project')

class Vote(db.Model, SerializerMixin):
    __tablename__ = 'votes'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String, nullable=False)  # 'approved' or 'declined'
    mentor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    
    # Add timestamps for tracking
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    # Relationships
    mentor = db.relationship('User', backref='votes')
    project = db.relationship('Project', backref='votes')

    # Serialize rules
    serialize_rules = ('-mentor.votes', '-project.votes')

    @validates('status')
    def validate_status(self, key, status):
        valid_statuses = ['approved', 'declined']
        if status not in valid_statuses:
            raise ValueError(f"Status must be one of: {', '.join(valid_statuses)}")
        return status
