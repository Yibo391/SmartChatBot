# 🤖 SmartChatBot

A full-stack chatbot application with React frontend, Node.js backend, FastAPI model service, and MySQL database.

## 🏗️ Architecture

- 🌐 **Frontend**: React application served on port 80
- ⚡ **Backend**: Node.js API service on port 3000
- 🧠 **Model Service**: FastAPI service running DialoGPT-medium on port 8000
- 💾 **Database**: MySQL 8.0 on port 3306

## 📋 Prerequisites

- 🐳 Docker and Docker Compose
- 🎮 NVIDIA GPU with appropriate drivers (for model service)
- 📦 Git

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd SmartChatBot
```

2. Start the application:
```bash
./run-docker.sh
```

## 🔧 Services

### 🌐 Frontend (port 80)
- React-based user interface
- Communicates with backend API
- Environment variables:
  - REACT_APP_API_URL: Backend API URL

### ⚡ Backend (port 3000)
- Node.js API service
- Handles business logic and database operations
- Environment variables:
  - DB_HOST: Database hostname
  - DB_USER: Database username
  - DB_PASSWORD: Database password
  - DB_NAME: Database name
  - MODEL_SERVICE_URL: URL for the model service

### 🧠 Model Service (port 8000)
- FastAPI service
- Runs DialoGPT-medium for text generation
- GPU-accelerated inference
- Endpoints:
  - POST /predict: Generate chat responses

### 💾 Database (port 3306)
- MySQL 8.0
- Persistent storage using Docker volumes
- Environment variables:
  - MYSQL_ROOT_PASSWORD: Root password
  - MYSQL_DATABASE: Database name

## 👨‍💻 Development

To modify the services:

1. Frontend changes: Edit files in `./frontend`
2. Backend changes: Edit files in `./backend`
3. Model service changes: Edit files in `./model_service`

After making changes, rebuild and restart the containers:
```bash
sudo docker compose down
sudo docker compose up --build
```

## ❗ Troubleshooting

If you encounter port conflicts:
1. Stop any services using the required ports (80, 3000, 8000, 3306)
2. Modify the port mappings in docker-compose.yml if needed
3. Restart the containers
