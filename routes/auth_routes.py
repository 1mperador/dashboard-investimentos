from flask import Blueprint, request, jsonify
from db import db
from models.usuario import criar_usuario, verificar_senha
from utils.auth import gerar_token

router = Blueprint("auth", __name__)

@router.route("/registro", methods=["POST"])
def registrar():
    data = request.get_json()
    if db.usuarios.find_one({"email": data.get("email")}):
        return jsonify({"error": "E-mail já registrado"}), 400

    novo = criar_usuario(data)
    db.usuarios.insert_one(novo)
    return jsonify({"message": "Usuário registrado com sucesso"}), 201

@router.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    usuario = db.usuarios.find_one({"email": data.get("email")})

    if not usuario or not verificar_senha(data.get("senha"), usuario["senha"]):
        return jsonify({"error": "Credenciais inválidas"}), 401

    token = gerar_token(usuario["email"])
    return jsonify({"token": token})
