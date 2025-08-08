import { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { InputField } from '../../../../components/ui';
import ChatAvatar from '../ui/ChatAvatar';

const NewChatModal = ({ chats, onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  const filteredChats = chats.filter(chat => 
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 200);
  };

  return (
    <div className={`absolute inset-0 bg-white z-50 flex flex-col ${isClosing ? 'animate-[slideOut_0.2s_ease-in_forwards]' : 'animate-[slideIn_0.2s_ease-out_forwards]'}`}>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOut {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
      `}</style>
      
      <div className="h-16 bg-primary border-b-4 border-black flex items-center px-4 shrink-0">
        <div className="flex items-center gap-4 text-white">
          <button 
            onClick={handleClose}
            className="hover:bg-black/20 p-2 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={24} strokeWidth={3} />
          </button>
          <h2 className="text-xl font-black uppercase">Nuevo Chat</h2>
        </div>
      </div>

      <div className="p-4 border-b-4 border-black bg-gray-50 shrink-0">
        <div className="relative">
          <InputField 
            type="text"
            placeholder="Buscar contactos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold" strokeWidth={3} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white flex flex-col">
        {filteredChats.length === 0 ? (
          <div className="text-center p-8 font-bold text-gray-500">
            No se encontraron contactos.
          </div>
        ) : (
          filteredChats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => {
                onSelect(chat);
                handleClose();
              }}
              className="flex items-center gap-3 p-4 border-b-2 border-black hover:bg-yellow-200 transition-colors cursor-pointer group"
            >
              <ChatAvatar config={chat.photo} name={chat.name} className="group-hover:shadow-[2px_2px_0px_0px_#000] transition-shadow" />
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-black text-lg leading-tight truncate">{chat.name}</h4>
                {chat.status && <p className="text-sm font-bold text-gray-600 truncate">{chat.status}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewChatModal;
