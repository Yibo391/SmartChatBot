import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // 初始化会话ID（简单生成，可以根据需求改进）
    const newSessionId = Date.now().toString();
    setSessionId(newSessionId);
  }, []);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = {
      sender: 'user',
      message: input,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post('http://localhost:3001/api/chat/send', {
        session_id: sessionId,
        message: input,
      });

      const botMessage = {
        sender: 'bot',
        message: response.data.reply,
        timestamp: new Date().toISOString(),
      };

      setMessages([...messages, userMessage, botMessage]);
      setInput('');
    } catch (error) {
      console.error('发送消息时出错:', error);
      const errorMessage = {
        sender: 'bot',
        message: '抱歉，出现了一些问题，请稍后再试。',
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, userMessage, errorMessage]);
    }
  };

  return (
    <div className="container mt-5">
      <h2>SmartChatBot</h2>
      <div className="card">
        <div className="card-body" style={{ height: '400px', overflowY: 'scroll' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${msg.sender === 'bot' ? 'text-left' : 'text-right'}`}
            >
              <strong>{msg.sender === 'bot' ? 'Bot' : 'You'}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <div className="card-footer">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="输入您的消息..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <div className="input-group-append">
              <button className="btn btn-primary" onClick={sendMessage}>
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
