from flask import Blueprint, request, jsonify, session
from functools import wraps
from Models import db, Vote, User, Project

votes_bp = Blueprint('votes', __name__)

# --- Helpers ---
def mentor_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401
        user = User.query.get(user_id)
        if not user or user.role != 'mentor':
            return jsonify({'error': 'This action requires mentor privileges'}), 403
        return f(*args, **kwargs)
    return decorated_function


# --- Create or Update Vote ---
@votes_bp.route('/votes', methods=['POST'])
@mentor_required
def create_or_update_vote():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    project_id = data.get('project_id')
    status = data.get('status')

    if not all([project_id, status]):
        return jsonify({'error': 'Missing required fields'}), 400

    if status not in ['approved', 'declined', 'pending']:
        return jsonify({'error': 'Invalid status'}), 400

    try:
        mentor_id = session['user_id']

        vote = Vote.query.filter_by(
            mentor_id=mentor_id,
            project_id=project_id
        ).first()

        if vote:
            vote.status = status
        else:
            vote = Vote(
                mentor_id=mentor_id,
                project_id=project_id,
                status=status
            )
            db.session.add(vote)

        db.session.commit()
        return jsonify({
            "id": vote.id,
            "status": vote.status,
            "mentor_id": vote.mentor_id,
            "project_id": vote.project_id,
            "mentor_name": vote.mentor.username if vote.mentor else None
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# --- Get all votes for a project ---
@votes_bp.route('/projects/<int:id>/votes', methods=['GET'])
def get_project_votes(id):
    votes = Vote.query.filter_by(project_id=id).all()

    return jsonify({
        'votes': [{
            "id": v.id,
            "status": v.status,
            "mentor_id": v.mentor_id,
            "mentor_name": v.mentor.username if v.mentor else None
        } for v in votes],
        'statistics': {
            'total': len(votes),
            'approved': sum(1 for v in votes if v.status == 'approved'),
            'declined': sum(1 for v in votes if v.status == 'declined')
        }
    }), 200


# --- Get votes made by the logged-in mentor ---
@votes_bp.route('/votes/mentor', methods=['GET'])
@mentor_required
def get_mentor_votes():
    mentor_id = session.get('user_id')
    votes = Vote.query.filter_by(mentor_id=mentor_id).all()

    voted_projects = []
    for vote in votes:
        project = Project.query.get(vote.project_id)
        if project:
            voted_projects.append({
                'id': project.id,
                'title': project.title,
                'description': project.description,
                'vote_status': vote.status
            })

    return jsonify(voted_projects), 200
