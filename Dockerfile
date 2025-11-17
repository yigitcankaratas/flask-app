FROM python:3.13-slim

WORKDIR /app

COPY app.py /app

CMD ["python", "app.py"]