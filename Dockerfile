FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ .

# Run the app
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
