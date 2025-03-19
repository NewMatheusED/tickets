from app.models import *
from flask import jsonify, session
from werkzeug.security import generate_password_hash
import bcrypt

class Controller:
    def __init__(self):
        pass

    def register(self, username, email, password):
        user = User.query.filter_by(email=email).first()
        if user:
            return jsonify({'message': 'User already exists'}), 400
        user_id_hash = bcrypt.hashpw(email.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user = User(user_id_hash=user_id_hash, username=username, email=email, password_hash=password)
        session['user_id_hash'] = user_id_hash
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201