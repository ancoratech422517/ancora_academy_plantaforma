from flask import Blueprint , jsonify, request
from models.database import db , Cursos

curso = Blueprint("curso" , __name__)
@curso.route("/api/courses" , methods=["POST"])
def Cursos_Ancora():
    data = request.get_json()
    new_c = Cursos(
        nome_curso=data['name'], categoria_curso=data['cat'], nivel_curso=data['level'], 
        duração_curso=data.get('duration'), preço_curso=int(data['price']), 
        imagem_curso=data['icon'], descricao=data['desc']
    )
    db.session.add(new_c)
    db.session.commit()
    return jsonify(new_c.to_dict())


@curso.route('/api/courses/<int:id>', methods=['PUT', 'DELETE'])
def handle_course(id):
    course = Cursos.query.get_or_404(id)
    if request.method == 'PUT':
        data = request.json
        course.nome_curso, course.categoria_curso, course.nivel_curso = data['name'], data['cat'], data['level']
        course.duração_curso, course.preço_curso, course.imagem_curso, course.descricao = data.get('duration'), int(data['price']), data['icon'], data['desc']
        db.session.commit()
        return jsonify({"success": True})
    elif request.method == 'DELETE':
        db.session.delete(course)
        db.session.commit()
        return jsonify({"success": True})


