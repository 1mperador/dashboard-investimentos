from flask import Blueprint, request, jsonify
from db import db
from bson.objectid import ObjectId
from utils.auth import autenticar

router = Blueprint("investimentos", __name__)


@router.route("/investimentos", methods=["POST"])
@autenticar
def criar_investimento():
    data = request.get_json()
    data["email"] = request.email_autenticado  # associa ao usuário
    db.investimentos.insert_one(data)
    return jsonify({"message": "Investimento criado com sucesso"}), 201

@router.route("/investimentos", methods=["GET"])
@autenticar
def listar_investimentos():
    email = request.email_autenticado
    investimentos = list(db.investimentos.find({"email": email}))
    for item in investimentos:
        item["_id"] = str(item["_id"])
    return jsonify(investimentos)

@router.route("/investimentos/<id>", methods=["DELETE"])
@autenticar
def deletar_investimento(id):
    email = request.email_autenticado
    resultado = db.investimentos.delete_one({"_id": ObjectId(id), "email": email})

    if resultado.deleted_count == 0:
        return jsonify({"error": "Investimento não encontrado ou acesso negado"}), 404

    return jsonify({"message": "Investimento removido"})
