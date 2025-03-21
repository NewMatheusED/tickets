from flask import Blueprint, request, jsonify, session
from app.models import User
import json


auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/check-login', methods=['GET'])
def check_login():
    user_id_hash = session.get('user_id_hash')
    if not user_id_hash:
        user_id_hash = request.cookies.get('user')
        if not user_id_hash:
            response = jsonify({'logged_in': False, 'message': 'User not logged in'})
            response.set_cookie('user', '', expires=0)
            return response, 401

    # Tenta buscar o usuário pelo campo user_id_hash
    user = User.query.filter_by(user_id_hash=user_id_hash).first()
    if not user:
        # Se o cookie estiver no formato JSON, converte; caso contrário, o valor já é
        try:
            if user_id_hash.strip() and user_id_hash.strip().startswith('{'):
                user_data = json.loads(user_id_hash)
            else:
                user_data = {}
        except (json.JSONDecodeError, AttributeError):
            user_data = {}
        user = User.query.filter_by(email=user_data.get('email')).first()
        if not user:
            return jsonify({'logged_in': False, 'message': 'User not found'}), 404
        else:
            session['user_id_hash'] = user.user_id_hash

    return jsonify({
        'username': user.username,
        'email': user.email,
        'profile_picture': user.profile_picture,
    }), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id_hash', None)
    response = jsonify({'message': 'Logged out successfully'})
    response.set_cookie('user', '', expires=0)
    response.set_cookie('session', '', expires=0)
    return response