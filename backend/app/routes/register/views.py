from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from .controller import Controller

controller = Controller()

register_bp = Blueprint('register_bp', __name__)

@register_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided'}), 400
    username = data['username']
    email = data['email']
    password = generate_password_hash(data['password'])
    return controller.register(username, email, password)