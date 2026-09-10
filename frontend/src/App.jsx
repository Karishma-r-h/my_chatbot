import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add the user's message to the chat immediately
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Send it to Django
    const response = await fetch('http://192.168.31.87:8000/api/chat/message/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, history: messages }),
    });
    const data = await response.json();

    // Add the AI's reply to the chat
    const botMessage = { sender: 'bot', text: data.reply };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="chat-container">
      {[
        { top: '-25px', left: '0px', rot: -10, size: 30 },
        { top: '-10px', left: '90px', rot: 20, size: 22 },
        { top: '30px', left: '-35px', rot: 15, size: 34 },
        { top: '80px', left: '-45px', rot: -5, size: 24 },
        { top: '130px', left: '-25px', rot: 25, size: 30 },
        { top: '10px', right: '-30px', rot: -15, size: 26 },
        { top: '70px', right: '-40px', rot: 10, size: 32 },
        { top: '150px', right: '-20px', rot: -20, size: 24 },
        { top: '210px', right: '-35px', rot: 15, size: 30 },
        { bottom: '160px', left: '-40px', rot: -10, size: 28 },
        { bottom: '110px', left: '-15px', rot: 20, size: 22 },
        { bottom: '60px', left: '-35px', rot: -25, size: 32 },
        { bottom: '150px', right: '-25px', rot: 5, size: 26 },
        { bottom: '90px', right: '-40px', rot: -15, size: 30 },
        { bottom: '20px', right: '-10px', rot: 20, size: 24 },
        { bottom: '-20px', right: '70px', rot: 10, size: 28 },
      ].map((pos, i) => (
        <svg
          key={i}
          className="doodle-flower"
          viewBox="0 0 100 100"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            bottom: pos.bottom,
            width: pos.size,
            height: pos.size,
            transform: `rotate(${pos.rot}deg)`,
          }}
        >
          <g fill="none" stroke="#D98BAE" strokeWidth="4" strokeLinecap="round">
            <circle cx="50" cy="35" r="10" />
            <circle cx="35" cy="50" r="10" />
            <circle cx="65" cy="50" r="10" />
            <circle cx="42" cy="62" r="10" />
            <circle cx="58" cy="62" r="10" />
            <circle cx="50" cy="50" r="6" />
          </g>
        </svg>
      ))}
      <h1>Ask Anything</h1>
      <div className="chat-window">
          {messages.map((msg, i) => (
          <div key={i} className={`bubble ${msg.sender}`}>
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
      </div>
      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="I'm listening..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;