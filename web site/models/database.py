from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Cursos(db.Model):
    __tablename__ = "Cursos"
    id = db.Column(db.Integer , primary_key = True )
    nome_curso = db.Column(db.Text , nullable = False , default = "none")
    categoria_curso = db.Column(db.Text , nullable = False , default = "none")
    nivel_curso = db.Column(db.Text , nullable = False , default = "none")
    duração_curso = db.Column(db.Text , nullable = False , default = "none")
    preço_curso = db.Column(db.Integer , nullable = False , default = 0)
    imagem_curso = db.Column(db.Text , nullable = False , default = "none")
    descricao = db.Column(db.Text , nullable = False , default = "none")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.nome_curso,
            "cat": self.categoria_curso,
            "level": self.nivel_curso,
            "duration": self.duração_curso,
            "price": self.preço_curso,
            "icon": self.imagem_curso, # Mapeia imagem_curso para o icon do Front
            "desc": self.descricao
        }

class Atividade(db.Model):
    __tablename__ = "Atividades"
    id = db.Column(db.Integer , primary_key = True)
    titulo_atividade = db.Column(db.Text , nullable = False , default = "none")
    data_atividade = db.Column(db.Text , nullable = False , default = "none")
    localização = db.Column(db.Text , nullable = False , default = "none")
    imagem_atividade = db.Column(db.Text , nullable = False , default = "none")
    descricao_atividade = db.Column(db.Text , nullable = False , default = "none")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.titulo_atividade,
            "date": self.data_atividade,
            "location": self.localização,
            "icon": self.imagem_atividade,
            "desc": self.descricao_atividade
        }

class Sistema(db.Model):
    __tablename__ = "Sistema"
    id = db.Column(db.Integer , primary_key = True)
    nome_sistema = db.Column(db.Text , nullable = False , default = "none")
    imagem_sistema = db.Column(db.Text , nullable = False , default = "none")
    descricao_sistema = db.Column(db.Text , nullable = False , default = "none")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.nome_sistema,
            "icon": self.imagem_sistema,
            "desc": self.descricao_sistema
        }

class Novidades(db.Model):
    __tablename__ = "Novidades"
    id = db.Column(db.Integer , primary_key = True)
    titulo_novidade = db.Column(db.Text , nullable = False , default = "none")
    data_novidade = db.Column(db.Text , nullable = False , default = "none")
    imagem_novidade = db.Column(db.Text , nullable = False , default = "none")
    conteudo_novidade = db.Column(db.Text , nullable = False , default = "none")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.titulo_novidade,
            "date": self.data_novidade,
            "icon": self.imagem_novidade,
            "excerpt": self.conteudo_novidade
        }