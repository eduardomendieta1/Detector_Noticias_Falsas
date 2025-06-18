# Usa una imagen oficial de Python compatible con TensorFlow
FROM python:3.10-slim

# Establece directorio de trabajo
WORKDIR /app

# Copia archivos
COPY . .

# Instala dependencias
RUN pip install --upgrade pip && pip install -r requirements.txt

# Expone el puerto por defecto de gunicorn
EXPOSE 8000

# Comando de inicio
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000"]