def novo_investimento(data):
    return {
        "tipo": data.get("tipo"),  # ex: ação, cripto, CDB
        "ativo": data.get("ativo"),  # ex: PETR4, BTC, Tesouro Selic
        "valor": float(data.get("valor")),
        "quantidade": float(data.get("quantidade")),
        "data": data.get("data")  # formato: "2025-07-20"
    }
