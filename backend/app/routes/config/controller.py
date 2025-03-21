from app.models import User
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