# Temel Python imajı
FROM python:3.11-slim

# Çalışma dizini
WORKDIR /app

# Gereksinimleri kopyala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Uygulamayı kopyala
COPY . .

# Uygulama portu
EXPOSE 5000

# Çalıştırma komutu
CMD ["python", "app.py"]
