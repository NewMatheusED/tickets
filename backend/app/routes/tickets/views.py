from flask import Blueprint, request, jsonify
from .controller import Controller
from app.decorators import verifyLoged

controller = Controller()

tickets_bp = Blueprint('tickets_bp', __name__)

@tickets_bp.route('/tickets', methods=['POST', 'GET'])
@verifyLoged
def handleTickets():
    if request.method == 'POST':
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No input data provided'}), 400
        result = controller.createTickets(data)
        return jsonify(result)
    elif request.method == 'GET':
        result = controller.getTickets()
        return jsonify(result)

@tickets_bp.route('/tickets/<ticket_id>', methods=['PUT', 'DELETE'])
@verifyLoged
def handleTicket(ticket_id):
    if request.method == 'PUT':
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No input data provided'}), 400
        print(data)
        result = controller.updateTicket(ticket_id, data)
        return jsonify(result)
    elif request.method == 'DELETE':
        result = controller.deleteTicket(ticket_id)
        return jsonify(result)