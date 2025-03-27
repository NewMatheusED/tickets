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
    
    def deleteTicket(self, ticket_id):
        ticket = Tickets.query.filter_by(ticket_id_hash=ticket_id).first()
        if not ticket:
            return {'message': 'Ticket not found'}, 404
        db.session.delete(ticket)
        db.session.commit()
        return {'message': 'Ticket deleted successfully'}, 200
    
    def updateTicket(self, ticket_id, data):
        ticket = Tickets.query.filter_by(ticket_id_hash=ticket_id).first()
        if not ticket:
            return {'message': 'Ticket not found'}, 404
        updatable_fields = [
            'observation', 'ticket_status'
        ]
        for field in updatable_fields:
            if field in data:
                setattr(ticket, field, data[field])
        
        ticket_user_base = User.query.filter_by(id=ticket.user_id).first().user_id_hash

        session_user = session.get('user_id_hash')

        if ticket_user_base == data.get('user_id'):
            ticket.user_id = User.query.filter_by(user_id_hash=session_user).first().id
        else:
            ticket.user_id = User.query.filter_by(id=data.get('user_id')).first().id

        
        ticket.ticket_date = datetime.utcnow()
        db.session.commit()
        return {'message': 'Ticket updated successfully'}, 200