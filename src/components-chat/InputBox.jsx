import { useState } from 'react';
import './Background.css';

const InputBox = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;
    onSend(message);
    setMessage('');
  };

  return (
    <form className="input-box" onSubmit={handleSubmit}>
      <input
        type="text"
        className="input-message"
        placeholder="Escribe un mensaje"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" className="send-button">➤</button>
    </form>
  );
};

export default InputBox;