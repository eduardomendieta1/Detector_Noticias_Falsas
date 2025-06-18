from flask import Flask, request, jsonify, render_template
import joblib
import numpy as np
from tensorflow.keras.models import load_model

app = Flask(__name__)
modelo = load_model('modelo_noticias_denso.h5')
vectorizador = joblib.load('vectorizador.pkl')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predecir', methods=['POST'])
def predecir():
    datos = request.get_json()
    texto = datos.get('texto', '')
    
    X = vectorizador.transform([texto]).toarray()
    prob = modelo.predict(X)[0][0]
    
    pred = 1 if prob >= 0.5 else 0
    confianza = round(prob * 100, 2) if pred == 1 else round((1 - prob) * 100, 2)
    
    return jsonify({
        'resultado': 'Verdadera' if pred == 1 else 'Falsa',
        'confianza': confianza
    })

if __name__ == '__main__':
    app.run(debug=True)