import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
import nltk
from nltk.corpus import stopwords
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
import numpy as np

# Descargar stopwords si no están disponibles
nltk.download('stopwords')
spanish_stopwords = stopwords.words('spanish')

# Cargar el dataset
df = pd.read_csv("Fake_news_es.csv")
df['class'] = df['class'].map({True: 1, False: 0})  # Asegurar valores 0 y 1

X = df['Text']
y = df['class']

# Dividir los datos
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Vectorizar texto
vectorizer = TfidfVectorizer(stop_words=spanish_stopwords, max_features=5000)
X_train_vec = vectorizer.fit_transform(X_train).toarray()
X_test_vec = vectorizer.transform(X_test).toarray()

# Definir la red neuronal
model = Sequential([
    Dense(128, input_shape=(X_train_vec.shape[1],), activation='relu'),
    Dropout(0.3),
    Dense(64, activation='relu'),
    Dropout(0.3),
    Dense(1, activation='sigmoid')  # salida binaria
])

model.compile(optimizer=Adam(learning_rate=0.001), loss='binary_crossentropy', metrics=['accuracy'])

# Entrenar
model.fit(X_train_vec, y_train, epochs=10, batch_size=32, validation_split=0.2,
          callbacks=[EarlyStopping(patience=2)])

# Guardar modelo y vectorizador
model.save('modelo_noticias_denso.h5')
joblib.dump(vectorizer, 'vectorizador.pkl')

# Evaluar
loss, acc = model.evaluate(X_test_vec, y_test)
print("Precisión en conjunto de prueba:", acc)