# Use a lightweight Python base image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy requirements first to leverage Docker's caching
COPY requirements.txt .

# Install dependencies (ignoring cache to keep the image size down)
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code (src folder, etc.)
COPY . .

# Expose the port Uvicorn runs on
EXPOSE 8000

# Command to start the FastAPI server
CMD ["uvicorn", "src.predict:app", "--host", "0.0.0.0", "--port", "8000"]
