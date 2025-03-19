from flask import Blueprint, request, jsonify, session
from app.models import User


auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/check-login', methods=['GET'])
def check_login():
    user_id_hash = session.get('user_id_hash')
    if not user_id_hash:
        return jsonify({'logged_in': False, 'message': 'User not logged in'}), 401

    user = User.query.filter_by(user_id_hash=user_id_hash).first()
    if not user:
        return jsonify({'logged_in': False, 'message': 'User not found'}), 404

    return jsonify({
        'logged_in': True,
        'username': user.username,
        'email': user.email
    }), 200