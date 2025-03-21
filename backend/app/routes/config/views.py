from flask import Blueprint, request, jsonify, current_app
import os
from werkzeug.utils import secure_filename
from .controller import Controller
from app.models import User

controller = Controller()

config_bp = Blueprint('config', __name__)

@config_bp.route('/config', methods=['POST'])
def update_config():
    username = request.form.get('username')
    email = request.form.get('email')
    profile_picture = request.files.get('profile_picture')
    
    if profile_picture:
        filename = secure_filename(profile_picture.filename)
        upload_folder = current_app.config.get('UPLOAD_FOLDER')
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        profile_picture.save(os.path.join(upload_folder, filename))
    else:
        filename = User.query.filter_by(email=email).first().profile_picture
    
    controller.update_user(username, email, filename)
    
    updated_user = {
         'username': username,
         'email': email,
         'profile_picture': filename
    }
    return jsonify(updated_user)

@config_bp.route('/deleteUser', methods=['DELETE'])
def delete_user():
    email = request.form.get('email')
    controller.delete_user(email)
    return jsonify({'message': 'User deleted'}), 200