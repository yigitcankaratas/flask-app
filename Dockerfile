# Multi-stage build for smaller production image
FROM python:3.11-slim as builder

# Build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Python dependencies
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Production stage
FROM python:3.11-slim

# Create non-root user
RUN groupadd -r flask && useradd -r -g flask flask

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy Python packages from builder
COPY --from=builder /root/.local /home/flask/.local

# Set up application
WORKDIR /app
COPY . .
RUN chown -R flask:flask /app

# Switch to non-root user
USER flask

# Set environment variables
ENV PATH=/home/flask/.local/bin:$PATH
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV PYTHONPATH=/app

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Expose port
EXPOSE 5000

# Use gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "30", "--keep-alive", "2", "--max-requests", "1000", "--max-requests-jitter", "50", "app:app"]