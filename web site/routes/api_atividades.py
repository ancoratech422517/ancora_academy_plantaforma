from flask import Blueprint , jsonify , request
from models.database import db , Atividade

atividades = Blueprint("atividades" , __name__)

@atividades.route('/api/activities', methods=['POST'])
def add_activity(): 
    try:
        data = request.json
        new_a = Atividade(
            titulo_atividade=data['title'], data_atividade=data['date'], 
            localização=data.get('location'), imagem_atividade=data['icon'], descricao_atividade=data['desc']
        )
        db.session.add(new_a)
        db.session.commit()
        return jsonify({"success": True}), 201
    except Exception as erro:
        print(f"Erro ao regitrar uma nova atividade:{erro}")
        return jsonify({"success": False})

@atividades.route('/api/activities/<int:id>', methods=['PUT', 'DELETE'])
def handle_activity(id):
    try:
        activity = Atividade.query.get_or_404(id)
        if request.method == 'PUT':
            data = request.json
            activity.titulo_atividade, activity.data_atividade = data['title'], data['date']
            activity.localização, activity.imagem_atividade, activity.descricao_atividade = data.get('location'), data['icon'], data['desc']
            db.session.commit()
            return jsonify({"success": True})
        elif request.method == 'DELETE':
            db.session.delete(activity)
            db.session.commit()
            return jsonify({"success": True})
    except Exception as erro:
        print(f"erro ao registrar uma nova atividade:{erro}")
        return jsonify({"success": False})
