from flask import Flask, request, jsonify, render_template
import joblib

app = Flask(__name__)
modelo = joblib.load('modelo_noticias.pkl')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predecir', methods=['POST'])
def predecir():
    datos = request.get_json()
    texto = datos.get('texto', '')
    
    # Predecir clase (0 o 1) y probabilidades
    pred = modelo.predict([texto])[0]
    prob = modelo.predict_proba([texto])[0]  # devuelve [prob_falsa, prob_verdadera]
    
    confianza = round(max(prob) * 100, 2)  # porcentaje de confianza
    
    return jsonify({
        'resultado': 'Verdadera' if pred == 1 else 'Falsa',
        'confianza': confianza
    })


if __name__ == '__main__':
    app.run(debug=True)
