from functools import wraps
from flask import request, jsonify, session
from app.models import *


def verifyLoged(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get('user_id_hash') is None:
            return jsonify({'message': 'Unauthorized access'}), 401
        return f(*args, **kwargs)
    return decorated_function