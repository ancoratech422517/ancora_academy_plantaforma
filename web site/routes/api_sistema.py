from flask import Blueprint , jsonify , request
from models.database import db , Sistema

sistemas = Blueprint("sistemas" , __name__)

@sistemas.route('/api/systems', methods=['POST'])
def add_system():
    data = request.json
    new_s = Sistema(nome_sistema=data['name'], imagem_sistema=data['icon'], descricao_sistema=data['desc'])
    db.session.add(new_s)
    db.session.commit()
    return jsonify({"success": True}), 201

@sistemas.route('/api/systems/<int:id>', methods=['PUT', 'DELETE'])
def handle_system(id):
    sys = Sistema.query.get_or_404(id)
    if request.method == 'PUT':
        data = request.json
        sys.nome_sistema, sys.imagem_sistema, sys.descricao_sistema = data['name'], data['icon'], data['desc']
        db.session.commit()
        return jsonify({"success": True})
    elif request.method == 'DELETE':
        db.session.delete(sys)
        db.session.commit()
        return jsonify({"success": True})
    