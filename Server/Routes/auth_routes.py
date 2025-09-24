from flask import request, session, jsonify
from flask_restful import Resource
from Models import  User, Cohort, Project
from sqlalchemy.exc import IntegrityError
from Config import db, api, app


class Signup(Resource):
   def post(self):
       data = request.get_json()
       username = data.get('username')
       email = data.get('email')
       password = data.get('password')
       role = data.get('role', 'student')
       cohort_name = data.get('cohort')
       if not (username and email and password and role and cohort_name):
           return {'error': 'Missing required fields'}, 400
       # Find or create cohort by name
       cohort = Cohort.query.filter_by(name=cohort_name).first()
       if not cohort:
           cohort = Cohort(name=cohort_name)
           db.session.add(cohort)
           db.session.commit()
       user = User(username=username, email=email, role=role, cohort_id=cohort.id)
       user.set_password(password)
       try:
           db.session.add(user)
           db.session.commit()
       except IntegrityError:
           db.session.rollback()
           return {'error': 'Username or email already exists'}, 400
       session['user_id'] = user.id
       return {'message': 'Signup successful', 'user': user.id}, 201


class Login(Resource):
   def post(self):
       data = request.get_json()
       email = data.get('email')
       password = data.get('password')
       print(f"[DEBUG] Login attempt for email: {email}")
       user = User.query.filter_by(email=email).first()
       if user:
           print(f"[DEBUG] User found: {user.username}, password_hash: {user.password_hash}")
           print(f"[DEBUG] Provided password: {password}")
           print(f"[DEBUG] Stored hash: {user.password_hash}")
           password_check = user.check_password(password)
           print(f"[DEBUG] Password check result: {password_check}")
           if password_check:
               session['user_id'] = user.id
               print(f"[DEBUG] Login successful for user_id: {user.id}")
               # Return full user profile for frontend context
               return {
                   'id': user.id,
                   'username': user.username,
                   'email': user.email,
                   'role': user.role,
                   'cohort': user.cohort.name if user.cohort else None
               }, 200
           else:
               print(f"[DEBUG] Password check failed for user: {user.username}")
       else:
           print(f"[DEBUG] No user found with email: {email}")
           print(f"[DEBUG] No user found with email: {email}")
       return {'error': 'Invalid credentials'}, 401


class Logout(Resource):
   def post(self):
       session.pop('user_id', None)
       return {'message': 'Logged out successfully'}, 200


class UserProfile(Resource):
   def get(self, id):
       user = User.query.get_or_404(id)
       projects = Project.query.filter_by(user_id=user.id).all()
       return {
           'id': user.id,
           'username': user.username,
           'email': user.email,
           'role': user.role,
           'cohort': user.cohort.name if user.cohort else None,
           'projects': [
               {
                   'id': p.id,
                   'title': p.title,
                   'description': p.description,
                   'status': p.status
               } for p in projects
           ]
       }
  




   def patch(self, id):
       user = User.query.get_or_404(id)
       data = request.get_json()
       if 'username' in data:
           user.username = data['username']
       if 'email' in data:
           user.email = data['email']
       if 'password' in data:
           user.set_password(data['password'])
       if 'role' in data:
           user.role = data['role']
       if 'cohort_id' in data:
           user.cohort_id = data['cohort_id']
       try:
           db.session.commit()
       except IntegrityError:
           db.session.rollback()
           return {'error': 'Username or email already exists'}, 400
       return {'message': 'Profile updated successfully'}, 200
  


api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(UserProfile, '/users/<int:id>')




