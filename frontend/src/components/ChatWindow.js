import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatWindow.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ChatWindow.css'
const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showThinking, setShowThinking] = useState({});
  const messagesEndRef = useRef(null);

  // 初始化会话ID
  useEffect(() => {
    setSessionId(Date.now().toString());
  }, []);

  // 消息滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 自动滚动触发
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 解析思考过程和消息内容
  const extractThinkingAndMessage = (message = '') => {
    const thinkRegex = /<think>([\s\S]*?)<\/think>/;
    const match = message.match(thinkRegex) || [];
    
    return {
      thinking: match[1]?.trim() || null,
      message: message.replace(thinkRegex, '').trim()
    };
  };

  // 发送消息处理
  const sendMessage = async () => {
    if (!input.trim() || isThinking) return;
    
    const userMessage = {
      sender: 'user',
      message: input.trim(),
      timestamp: new Date().toISOString()
    };

    // 立即显示用户消息
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await axios.post('http://localhost:3001/api/chat/send', {
        session_id: sessionId,
        message: userMessage.message
      });

      const { thinking, message } = extractThinkingAndMessage(response.data?.reply);
      
      const botMessage = {
        sender: 'bot',
        message: message || 'No response from server',
        thinking: thinking,
        timestamp: new Date().toISOString()
      };

      // 添加机器人消息并设置思考可见性
      setMessages(prev => [...prev, botMessage]);
      setShowThinking(prev => ({
        ...prev,
        [prev.length]: true // 使用最新消息的索引
      }));

    } catch (error) {
      console.error('API Error:', error);
      setMessages(prev => [...prev, {
        sender: 'bot',
        message: 'Error: Failed to get response',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  // 切换思考内容显示
  const toggleThinking = (index) => {
    setShowThinking(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // 格式化思考内容
  const formatThinking = (thinking) => {
    return thinking?.split('\n').map((line, i) => (
      <div key={i} className="thinking-line">{line}</div>
    ));
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>AI Assistant</h2>
        <div className="session-id">Session: {sessionId}</div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.sender}`}>
            <div className="message-header">
              <span className="sender">{msg.sender === 'bot' ? '🤖' : '👤'}</span>
              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            <div className="message-text">{msg.message}</div>

            {msg.thinking && (
              <div className="thinking-section">
                <button 
                  className="thinking-toggle"
                  onClick={() => toggleThinking(index)}
                >
                  {showThinking[index] ? '▼' : '▶'} Thinking Process
                </button>
                {showThinking[index] && (
                  <div className="thinking-content">
                    {formatThinking(msg.thinking)}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="thinking-indicator">
            <div className="dot-flashing"></div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          disabled={isThinking}
        />
        <button 
          onClick={sendMessage}
          disabled={isThinking}
        >
          {isThinking ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;