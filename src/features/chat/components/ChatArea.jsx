import { useChatSocket } from '../../../hooks/socket/useChatSocket';
import ChatHeader from './chat-area/ChatHeader';
import MessageList from './chat-area/MessageList';
import MessageInput from './chat-area/MessageInput';
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const ChatArea = ({ activeChat, currentUserId }) => {
  const { messages, sendMessage, setTyping, isContactTyping } = useChatSocket(activeChat?.id);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setShowSearch(false);
    setSearchQuery('');
  }, [activeChat?.id]);

  const filteredMessages = messages.filter(m => 
    m.msg_text?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (content) => {
    sendMessage(content);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#e5e5f7] relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
      
      {activeChat ? (
        <>
          <ChatHeader 
            activeChat={activeChat}
            isTyping={isContactTyping}
            onSearch={() => setShowSearch(!showSearch)}
            onOptions={() => console.log('Chat options')}
          />
          {showSearch && (
            <div className="bg-white border-b-4 border-black p-2 flex items-center gap-2 z-10 relative">
              <Search size={18} className="text-gray-500 ml-2" />
              <input 
                type="text" 
                placeholder="Buscar en el chat..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 h-10 px-2 outline-none font-bold text-sm bg-transparent"
              />
              <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="p-2 hover:bg-gray-200 rounded-sm cursor-pointer">
                <X size={18} className="text-black" />
              </button>
            </div>
          )}
          <MessageList 
            messages={showSearch && searchQuery ? filteredMessages : messages}
            currentUserId={currentUserId} 
          />
          <MessageInput 
            onSend={handleSendMessage}
            onTyping={setTyping}
            disabled={!activeChat}
          />
        </>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center relative z-10 p-6 text-center">
          <div className="bg-white border-4 border-black p-6 rounded-sm shadow-[8px_8px_0px_0px_#000] max-w-md">
            <h2 className="text-2xl font-black mb-2 text-black">ChatHub</h2>
            <p className="font-bold text-gray-600">Selecciona un chat del panel izquierdo para comenzar a mensajear.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
