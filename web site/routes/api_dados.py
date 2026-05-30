from flask import Blueprint , jsonify
from models.database import db , Cursos , Atividade , Sistema , Novidades

dados = Blueprint("dados" , __name__)
@dados.route("/api/data" , methods=["GET"])
def Dados():
    cursos = Cursos.query.all()
    atividades = Atividade.query.all()
    sistemas = Sistema.query.all()
    novidades = Novidades.query.all()
 

    cursos_list = [curso.to_dict() for curso in cursos]
    atividades_list = [atividade.to_dict() for atividade in atividades]
    sistemas_list = [sistema.to_dict() for sistema in sistemas]
    novidades_list = [novidade.to_dict() for novidade in novidades] 


    return jsonify({
        "courses": cursos_list,
        "activities": atividades_list,
        "systems": sistemas_list,
        "news": novidades_list

    })


