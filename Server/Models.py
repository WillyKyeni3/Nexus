from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from Config import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone

class User(db.Model, SerializerMixin):
   __tablename__ = 'users'


   id = db.Column(db.Integer, primary_key=True)
   username = db.Column(db.String, unique=True, nullable=False)
   email = db.Column(db.String, unique=True, nullable=False)
   password_hash = db.Column(db.String, nullable=False)
   role = db.Column(db.String, nullable=False, default="student")  # student or mentor
   cohort_id = db.Column(db.Integer, db.ForeignKey('cohorts.id'))


   # relationships
   projects = db.relationship('Project', back_populates='user', cascade="all, delete-orphan")
   cohort = db.relationship('Cohort', back_populates='users')
   serialize_rules = ("-projects.user", "-cohort.users")


   def set_password(self, password):
       self.password_hash = generate_password_hash(password)


   def check_password(self, password):
       return check_password_hash(self.password_hash, password)
  

class Cohort(db.Model, SerializerMixin):
   __tablename__ = 'cohorts'
   id = db.Column(db.Integer, primary_key=True)
   name = db.Column(db.String, unique=True, nullable=False)
   users = db.relationship('User', back_populates='cohort', cascade="all, delete-orphan")
  










