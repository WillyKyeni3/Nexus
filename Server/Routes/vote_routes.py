from flask import Blueprint, request, jsonify, session
from functools import wraps
from Models import db, Vote, User

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


# --- Routes ---
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

    if status not in ['approved', 'declined']:
        return jsonify({'error': 'Status must be either "approved" or "declined"'}), 400

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
        return jsonify(vote.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@votes_bp.route('/projects/<int:id>/votes', methods=['GET'])
def get_project_votes(id):
    votes = Vote.query.filter_by(project_id=id).all()

    total_votes = len(votes)
    approved_votes = sum(1 for v in votes if v.status == 'approved')
    declined_votes = sum(1 for v in votes if v.status == 'declined')

    return jsonify({
        'votes': [v.to_dict() for v in votes],
        'statistics': {
            'total': total_votes,
            'approved': approved_votes,
            'declined': declined_votes
        }
    }), 200
