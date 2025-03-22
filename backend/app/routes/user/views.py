from flask import Blueprint, request, jsonify, current_app
from .controller import Controller
from app.models import User

controller = Controller()

user_bp = Blueprint('user', __name__)

@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = []
    for user in users:
        users_list.append({
            'username': user.username,
            'email': user.email,
            'profile_picture': user.profile_picture,
            'id': user.id
        })
    return jsonify(users_list)