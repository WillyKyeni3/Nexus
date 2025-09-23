from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from Config import db
from sqlalchemy.orm import validates
from datetime import datetime, timezone


class Project(db.Model, SerializerMixin):
    __tablename__ ='projects'
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String,nullable = False)
    description = db.Column(db.String, nullable = False)
    date_created = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    author_name = db.Column(db.String, nullable = False, default = 'Uknown Author')
    status = db.Column(db.String, default="pending")
 

     # a usercan have many projects
    #user = db.relationship('User', back_populates='projects')
     # a project can have many votes
    #votes = db.relationship('Vote', back_populates = 'project', cascade = 'all, delete-orphan')
    #serialize_rules = ("-user.projects",)




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
        return f'<Project {self.id} {self.title}'
    





