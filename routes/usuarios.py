from flask import Blueprint, jsonify
from bson import ObjectId
from db import usuarios_collection

usuarios_bp = Blueprint('usuarios', __name__)

@usuarios_bp.route('/usuarios/<id>/ativos')
def ativos_usuario(id):
    usuario = usuarios_collection.find_one({"_id": ObjectId(id)})
    if usuario and "ativos" in usuario:
        return jsonify({"acoes": usuario["ativos"]})
    return jsonify({"erro": "Usuário não encontrado ou sem ativos"}), 404
