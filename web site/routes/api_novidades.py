from flask import Blueprint , jsonify , request
from models.database import db , Novidades

novidades = Blueprint("novidades" , __name__)


@novidades.route('/api/news', methods=['POST'])
def add_news():
    data = request.json
    new_n = Novidades(titulo_novidade=data['title'], data_novidade=data['date'], imagem_novidade=data['icon'], conteudo_novidade=data['excerpt'])
    db.session.add(new_n)
    db.session.commit()
    return jsonify({"success": True}), 201

@novidades.route('/api/news/<int:id>', methods=['PUT', 'DELETE'])
def handle_news(id):
    news_item = Novidades.query.get_or_404(id)
    if request.method == 'PUT':
        data = request.json
        news_item.titulo_novidade, news_item.data_novidade = data['title'], data['date']
        news_item.imagem_novidade, news_item.conteudo_novidade = data['icon'], data['excerpt']
        db.session.commit()
        return jsonify({"success": True})
    elif request.method == 'DELETE':
        db.session.delete(news_item)
        db.session.commit()
        return jsonify({"success": True})