import { useState } from 'react';
import './Background.css';
import InputBox from './InputBox';

const ChatWindow = ({ chat }) => {
  const [messages, setMessages] = useState([
    { id: 1, fromMe: false, text: 'Hola, ¿cómo estás?' },
    { id: 2, fromMe: true, text: 'Bien, ¿y tú?' },
    { id: 3, fromMe: false, text: 'Todo bien. ¿Listo para el proyecto?' },
  ]);

  const handleSend = (messageText) => {
    if (!messageText.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      fromMe: true,
      text: messageText,
    };
    setMessages([...messages, newMessage]);
  };

  if (!chat) {
    return (
      <div className="chat-window no-chat">
        <p>Selecciona un chat para comenzar a chatear.</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header-sidebar">
        <img src={chat.avatar} alt={chat.name} className="chat-header-avatar" />
        <span className="chat-header-name">{chat.name}</span>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-bubble ${msg.fromMe ? 'from-me' : 'from-them'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <InputBox onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;