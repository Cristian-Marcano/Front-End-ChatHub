import { useState, useRef, useEffect } from 'react';
import { Paperclip, Send } from 'lucide-react';
import ChatIconButton from '../ui/ChatIconButton';

const MessageInput = ({ onSend, onTyping, disabled }) => {
  const [text, setText] = useState('');
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
      if (onTyping) {
        onTyping(false);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    
    if (onTyping && !disabled) {
      onTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-[72px] border-t-4 border-black bg-white flex items-center px-4 py-3 gap-4 shrink-0 relative z-10">
      <ChatIconButton icon={Paperclip} onClick={() => {}} title="Adjuntar" />
      
      <input 
        type="text" 
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Escribe un mensaje..." 
        className="flex-1 h-12 px-4 bg-gray-100 border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:bg-white focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all font-bold text-black disabled:opacity-50"
      />
      
      <button 
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        className="bg-primary text-white border-2 border-black h-12 w-12 flex items-center justify-center rounded-sm shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={20} />
      </button>
    </div>
  );
};

export default MessageInput;
