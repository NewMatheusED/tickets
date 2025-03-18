from functools import wraps
from flask import request, jsonify

def verifyLoged(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"message": "Token is required"}), 401
        return f(*args, **kwargs)
    return decorated_function