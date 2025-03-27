from flask import jsonify
from app.models import User
from werkzeug.security import check_password_hash, generate_password_hash
from app import db

class Controller:
    def __init__(self):
        pass

    def update_user(self, username, email, profile_picture):
        user = User.query.filter_by(email=email).first()
        user.username = username
        user.profile_picture = profile_picture
        db.session.commit()

    def delete_user(self, email):
        user = User.query.filter_by(email=email).first()
        db.session.delete(user)
        db.session.commit()

    def change_password(self, user, data):
        print(data)
        user = User.query.filter_by(user_id_hash=user).first()
        print(user.password_hash)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        if not check_password_hash(user.password_hash, data.get('oldPassword')):
            return jsonify({'message': 'Senha antiga incorreta'}), 400

        new_password = data.get('newPassword')

        if check_password_hash(user.password_hash, new_password):
            return jsonify({'message': 'New password cannot be the same as the old password'}), 400

        user.password_hash = generate_password_hash(new_password)
        print(user.password_hash)
        db.session.commit()

        return jsonify({'message': 'Password updated successfully'}), 200
