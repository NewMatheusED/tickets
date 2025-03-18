from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from .controller import Controller

controller = Controller()

register_bp = Blueprint('register_bp', __name__)

@register_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    if controller.get_user_by_username(username):
        return jsonify({"message": "Username already exists"}), 400

    controller.create_user(username, generate_password_hash(password))
    return jsonify({"message": "User created successfully"}), 201