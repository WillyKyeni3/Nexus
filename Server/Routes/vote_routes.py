from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from functools import wraps
from Models import db, Vote

votes_bp = Blueprint('votes', __name__)

def mentor_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or current_user.role != 'mentor':
            return jsonify({'error': 'This action requires mentor privileges'}), 403
        return f(*args, **kwargs)
    return decorated_function

@votes_bp.route('/votes', methods=['POST'])
@login_required
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
        vote = Vote.query.filter_by(
            mentor_id=current_user.id,
            project_id=project_id
        ).first()

        if vote:
            vote.status = status
        else:
            vote = Vote(
                mentor_id=current_user.id,
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
    approved_votes = sum(1 for vote in votes if vote.status == 'approved')
    declined_votes = sum(1 for vote in votes if vote.status == 'declined')

    return jsonify({
        'votes': [vote.to_dict() for vote in votes],
        'statistics': {
            'total': total_votes,
            'approved': approved_votes,
            'declined': declined_votes
        }
    }), 200
