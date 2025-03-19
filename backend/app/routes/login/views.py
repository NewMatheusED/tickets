from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from .controller import Controller

controller = Controller()

login_bp = Blueprint('login_bp', __name__)

@login_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided'}), 400
    email = data['email']
    password = data['password']
    return controller.login(email, password)