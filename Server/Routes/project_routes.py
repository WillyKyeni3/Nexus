from flask_restful import Resource
from flask import session, request, jsonify, make_response
from Config import app, db, api
from Models import Project, User





class Projects(Resource):
    def get (self):
        projects = Project.query.all()
        return make_response(
            jsonify([project.to_dict() for project in projects] )
        )
    def post(self):
        from flask import session
        if 'user_id' not in session:
            return make_response({'error': 'Authentication required'}, 401)
        data = request.get_json()
        new_project = Project(
            title = data.get('title'),
            description = data.get('description'),
            user_id = session['user_id'],
            author_name = data.get('author_name')
        )
        db.session.add(new_project)
        db.session.commit()
        return make_response(new_project.to_dict(), 201)
    
class ProjectsByID(Resource):
    def get(self, id):
        project = Project.query.get(id)
        if not project:
            return make_response({'error': 'project not found'}, 404)
        return make_response(project.to_dict(),200)
    def patch(self, id):
        project = Project.query.get(id)
        if not project:
            return make_response({'error': 'project not found'}, 404)
        data = request.get_json()
        for key, value in data.items():
            setattr(project, key, value)
        db.session.commit()
        return make_response(project.to_dict(), 200)
    def delete(self, id):
        project = Project.query.get(id)
        if not project:
            return make_response({'error': 'project not found'}, 404)
        db.session.delete(project)
        db.session.commit()
        return make_response({}, 204)


class ProjectsByUserID(Resource):
    def get(self, user_id):
        projects = Project.query.filter_by(user_id=user_id).all()
        return make_response(
            jsonify([project.to_dict() for project in projects])
        )
    

class Users(Resource):
    def get(self):
        users = User.query.all()
        return make_response(
            jsonify([user.to_dict() for user in users])
        )
    def post(self):
        data = request.get_json()
        new_user = User(
            username = data.get('username'),
            email = data.get('email'),
            password_hash = data.get('password_hash'),
            role = data.get('role'),
            cohort_id = data.get('cohort_id')
        )
        db.session.add(new_user)
        db.session.commit()
        return make_response(new_user.to_dict(), 201)
    
class UsersByID(Resource): 
    def get(self, id):
        user = User.query.get(id)
        if not user:
            return make_response({'error': 'user not found'}, 404)
        return make_response(user.to_dict(),200)
    def patch(self, id):
        user = User.query.get(id)
        if not user:
            return make_response({'error': 'user not found'}, 404)
        data = request.get_json()
        for key, value in data.items():
            setattr(user, key, value)
        db.session.commit()
        return make_response(user.to_dict(), 200)
    def delete(self, id):
        user = User.query.get(id)
        if not user:
            return make_response({'error': 'user not found'}, 404)
        db.session.delete(user)
        db.session.commit()
        return make_response({}, 204)
    

    

api.add_resource(Projects, '/projects')
api.add_resource(ProjectsByID, '/projects/<int:id>')
api.add_resource(Users, '/users')
api.add_resource(UsersByID, '/users/<int:id>')
api.add_resource(ProjectsByUserID, '/users/<int:user_id>/projects')










