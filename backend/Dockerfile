# Backend Dockerfile for Kizuna API Service
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Prevent Python from writing .pyc files & enable unbuffered logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt
RUN pip install --no-cache-dir email-validator

# Copy application source code
COPY backend /app/backend

# Create directory for persistent SQLite database
RUN mkdir -p /app/backend/app

# Expose port
EXPOSE 8000

# Entrypoint script: seed database if first run, then start Uvicorn
CMD ["sh", "-c", "python -m backend.app.seed && uvicorn backend.app.main:app --host 0.0.0.0 --port 8000"]

