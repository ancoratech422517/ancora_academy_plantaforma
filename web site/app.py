import os
import socket
from flask import Flask
from dotenv import load_dotenv
from models.database import db
from routes.home import home
from routes.api_dados import dados
from routes.api_cursos import curso
from routes.api_sistema import sistemas
from routes.api_novidades import novidades
from routes.api_atividades import atividades

# Carrega as variáveis do ficheiro .env
load_dotenv()

app = Flask(__name__)
app.register_blueprint(home)

# ─── CONFIGURAÇÃO DE INTELIGÊNCIA DE BANCO DE DADOS ──────────────────────────

NEON_URL = os.getenv('DATABASE_URL')
SQLITE_URL = "sqlite:///Ancora_Academy.db"

def verificar_internet(host="8.8.8.8", port=53, timeout=10):
    """Função rápida para testar se a tua máquina tem acesso à internet"""
    try:
        socket.setdefaulttimeout(timeout)
        socket.socket(socket.AF_INET, socket.SOCK_STREAM).connect((host, port))
        return True
    except socket.error:
        return False

# Decisão automática de qual banco usar
if NEON_URL and verificar_internet():
    print("🌐 CONECTADO À INTERNET: A usar o Banco de Dados Nuvem (Neon PostgreSQL)!")
    app.config['SQLALCHEMY_DATABASE_URI'] = NEON_URL
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {"pool_pre_ping": True}
else:
    print("🔌 MODO OFFLINE: Sem internet ou sem .env. A usar o Banco de Dados Local (SQLite)!")
    app.config['SQLALCHEMY_DATABASE_URI'] = SQLITE_URL
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {}

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializa o banco de dados conforme a escolha acima
db.init_app(app)

with app.app_context():
    try:
        db.create_all()
        print("✅ Tabelas verificadas/criadas com sucesso no banco ativo.")
    except Exception as e:
        print(f"⚠️ Erro ao tentar conectar ao Neon. Mudando para SQLite de emergência... Erro: {e}")
        # Se falhar mesmo assim (ex: credenciais erradas), força o SQLite para o app não crashar
        app.config['SQLALCHEMY_DATABASE_URI'] = SQLITE_URL
        db.create_all()

# ─── REGISTAR BLUEPRINTS ──────────────────────────────────────────────────────
app.register_blueprint(dados)
app.register_blueprint(curso)
app.register_blueprint(sistemas)
app.register_blueprint(novidades)
app.register_blueprint(atividades)

if __name__ == "__main__":
    app.run(debug=True)