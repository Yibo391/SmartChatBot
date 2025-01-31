# 🌟 SmartChatBot

A modern chat interface with AI-powered responses and smart FAQ system.

<div align="center">
  <p><strong>💭 Deep Thinking Process</strong></p>
  <img src="https://user-images.githubusercontent.com/112749262/282583009-0e7499c3-cbd0-4e70-be6a-1d2265e3496c.png" alt="Deep Thinking Demo" width="800px"/>
  
  <p><strong>📚 Smart FAQ System</strong></p>
  <img src="https://user-images.githubusercontent.com/112749262/282583019-cba97f7c-fe9d-4312-9d83-d5183517bd20.png" alt="FAQ System Demo" width="800px"/>

  [Live Demo](https://github.com/Yibo391/SmartChatBot) | [Report Bug](https://github.com/Yibo391/SmartChatBot/issues) | [Request Feature](https://github.com/Yibo391/SmartChatBot/issues)
</div>

## 🚀 Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/Yibo391/SmartChatBot.git
cd SmartChatBot
```

2. **Install Ollama**
```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# Download from https://ollama.com/download/windows
```

3. **Run the AI Model**
```bash
# Pull and run the model
ollama run deepseek-r1:7b
```

4. **Set up the database**
```bash
# Create database and tables
mysql -u your_username -p < backend/scripts/create_database.sql
# Insert FAQ data
mysql -u your_username -p smartchatbot < backend/scripts/insert_faq_data.sql
```

5. **Install and Run**
```bash
# Backend setup
cd backend
npm install
npm start

# Frontend setup (new terminal)
cd frontend
npm install
npm start
```

## ✨ Key Features

- 🤖 **AI-Powered Chat**
  - Deep thinking process visualization
  - Detailed reasoning steps
  - Contextual responses

- 💡 **Smart FAQ System**
  - Categorized questions
  - Tag-based filtering
  - One-click answers

## 🔧 Configuration

Create a `.env` file in the backend directory:

```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=smartchatbot
PORT=3001

OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=deepseek-r1:7b
```

## 🎯 How It Works

### Deep Thinking Process
The chatbot shows its reasoning process, helping you understand how it arrived at its answers. Click the "Thinking Process" button to see the detailed steps.

<div align="center">
  <img src="https://github.com/Yibo391/SmartChatBot/blob/main/deep_think.png" alt="Thinking Process Demo" width="800px"/>
  <p><em>Thinking Process Visualization</em></p>
</div>
 
### FAQ System
Quick access to common questions through:
- Category browsing
- Tag filtering
- Instant answers
- Seamless chat integration

<div align="center">
  <img src="https://github.com/Yibo391/SmartChatBot/blob/main/general question.png" alt="Thinking Process Demo" width="800px"/>
  <p><em>QAs Visualization</em></p>
</div>
## 🤝 Troubleshooting

1. **Ollama Issues**
```bash
# Start Ollama service
ollama serve

# Check available models
ollama list

# Test API
curl http://localhost:11434/api/generate
```

2. **Database Issues**
```bash
# Check MySQL service
sudo service mysql status

# Reset database
mysql -u your_username -p < backend/scripts/create_database.sql
```

## 📝 License

This project is [MIT](https://github.com/Yibo391/SmartChatBot/blob/main/LICENSE) licensed.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/Yibo391">Yibo</a><br/>
  Star ⭐ this repository if you find it helpful!
</div>
