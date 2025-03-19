from app.models import User
from werkzeug.security import check_password_hash
from flask import jsonify, session

class Controller:
    def __init__(self):
        pass

    def login(self, email, password):
        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({'message': 'Invalid credentials'}), 401
        session['user_id_hash'] = user.user_id_hash
        return jsonify({'message': 'Logged in successfully'}), 200
