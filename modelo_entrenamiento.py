import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import joblib
import nltk
from nltk.corpus import stopwords

# Descargar stopwords si no están disponibles
nltk.download('stopwords')
spanish_stopwords = stopwords.words('spanish')

# Cargar el dataset
df = pd.read_csv("Fake_news_es.csv")

# Asegurar que las etiquetas sean numéricas
df['class'] = df['class'].map({True: 1, False: 0})

# Dividir los datos
X = df['Text']
y = df['class']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Crear el pipeline con stopwords personalizados
modelo = Pipeline([
    ('tfidf', TfidfVectorizer(stop_words=spanish_stopwords)),
    ('clf', MultinomialNB())
])

# Entrenar
modelo.fit(X_train, y_train)

# Guardar el modelo
joblib.dump(modelo, 'modelo_noticias.pkl')

# Mostrar precisión
print("Precisión en conjunto de prueba:", modelo.score(X_test, y_test))

