from app.models import *
from flask import session
import random

class Controller:
    def __init__(self):
        pass

    def createTickets(self, data):
        if not data['title'] or not data['type_error'] or not data['solicitante'] or not data['setor']:
            return {'message': 'Missing required fields'}, 400
        user_id = User.query.filter_by(user_id_hash=session.get('user_id_hash')).first().id

        while True:
            ticket_id_hash = str(random.randint(10000, 99999))
            if not Tickets.query.filter_by(ticket_id_hash=ticket_id_hash).first():
                break

        ticket = Tickets(
            user_id=user_id,
            ticket_id_hash=ticket_id_hash,
            observation=data.get('observation', ''),
            title=data.get('title'),
            type_error=data.get('type_error'),
            solicitante=data.get('solicitante'),
            chamado_externo=data.get('chamado_externo', ''),
            setor=data.get('setor')
        )
        db.session.add(ticket)
        db.session.commit()
        return {'message': 'Ticket created successfully'}, 201
    
    def getTickets(self):
        tickets = Tickets.query.all()
        result = []
        for ticket in tickets:
            result.append({
                'id': ticket.ticket_id_hash,
                'ticket_status': ticket.ticket_status,
                'ticket_date': ticket.ticket_date,
                'observation': ticket.observation,
                'title': ticket.title,
                'type_error': ticket.type_error,
                'solicitante': ticket.solicitante,
                'chamado_externo': ticket.chamado_externo,
                'user_id': ticket.user_id,
                'setor': ticket.setor
            })
        return result