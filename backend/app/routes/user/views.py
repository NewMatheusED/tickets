from flask import Blueprint, request, jsonify, current_app, send_from_directory
from .controller import Controller
from app.models import User
import os

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

UPLOAD_FOLDER = '/var/www/ticketshelpme/tickets/backend/app/static/uploads'

@user_bp.route('/media/<filename>', methods=['GET'])
def serve_media(filename):
    # Adicionar a extensão .jpg se o nome não a tiver
    possible_extensions = ['.jpg', '.jpeg', '.png', '.gif']
    
    # Verifica se o arquivo existe com a extensão fornecida
    for ext in possible_extensions:
        file_path = os.path.join(UPLOAD_FOLDER, filename + ext)
        if os.path.exists(file_path):
            return send_from_directory(UPLOAD_FOLDER, filename + ext)
    
    return "Arquivo não encontrado", 404