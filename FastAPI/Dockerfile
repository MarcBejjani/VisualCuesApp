# Use official Python image
FROM python:3.10

# Set the working directory in the container
WORKDIR /app

# Copy only requirements first
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the backend port
EXPOSE 5001

# Command to run the FastAPI app with reload
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5001", "--reload"]
