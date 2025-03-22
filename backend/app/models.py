from datetime import datetime
from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id_hash = db.Column(db.String(255), index=True, unique=True)
    username = db.Column(db.String(64), index=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(255))
    profile_picture = db.Column(db.String(255), default='default.jpg')

class Tickets(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ticket_id_hash = db.Column(db.String(255), index=True, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    ticket_status = db.Column(db.String(64), default='open')
    ticket_date = db.Column(db.DateTime, index=True, default=db.func.current_timestamp())
    observation = db.Column(db.String(256))
    title = db.Column(db.String(64))
    type_error = db.Column(db.String(64))
    solicitante = db.Column(db.String(128))
    chamado_externo = db.Column(db.String(64))
    setor = db.Column(db.String(64))