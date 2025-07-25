from flask import Flask, jsonify
from routes.investimento_routes import router as investimento_routes
from routes.auth_routes import router as auth_routes
from flask_cors import CORS

app = Flask(__name__)
app.register_blueprint(investimento_routes)
app.register_blueprint(auth_routes)
CORS(app)

@app.route('/ativos')
def ativos():
    return jsonify({
        "acoes": {
            "PETR4": 5000,
            "ITUB4": 3000,
            "VALE3": 2000
        }
    })
@app.route("/ping")
def ping():
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(debug=True)
