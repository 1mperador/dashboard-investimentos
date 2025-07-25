from flask_bcrypt import generate_password_hash, check_password_hash

def criar_usuario(data):
    return {
        "email": data.get("email"),
        "senha": generate_password_hash(data.get("senha")).decode('utf-8')
    }

def verificar_senha(senha_plana, senha_hash):
    return check_password_hash(senha_hash, senha_plana)
