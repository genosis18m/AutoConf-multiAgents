FROM python:3.12

WORKDIR /app

# Install system dependencies needed by chromadb / onnxruntime
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ .

# Run the app
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
