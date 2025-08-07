import { useState } from 'react';
import { createPortal } from 'react-dom';
import { MessageSquarePlus, X, Search } from 'lucide-react';
import { InputField } from '../../../../components/ui';
import ChatAvatar from '../ui/ChatAvatar';

const NewChatModal = ({ chats, onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(chat => 
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white p-6 md:p-8 rounded-sm border-4 border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-md h-[80vh] flex flex-col relative">
        
        <button 
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-red-400 border-2 border-black p-2 rounded-sm shadow-[2px_2px_0px_0px_#000] hover:bg-red-500 hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all z-10"
        >
          <X size={20} strokeWidth={3} className="text-black" />
        </button>

        <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-4">
          <h3 className="text-2xl font-black uppercase flex items-center gap-2">
            <MessageSquarePlus size={24} strokeWidth={3} />
            Nuevo Chat
          </h3>
        </div>

        <div className="relative mb-4">
          <InputField 
            type="text"
            placeholder="Buscar contactos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="absolute right-3 top-[38px] -translate-y-1/2 text-gray-400 font-bold" strokeWidth={3} />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-2">
          {filteredChats.length === 0 ? (
            <div className="text-center p-4 border-2 border-dashed border-gray-400 font-bold text-gray-500">
              No tienes contactos o no coinciden con la búsqueda.
            </div>
          ) : (
            filteredChats.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => {
                  onSelect(chat);
                  onClose();
                }}
                className="flex items-center justify-between p-3 border-2 border-transparent hover:border-black hover:bg-yellow-200 transition-colors cursor-pointer group rounded-sm"
              >
                <div className="flex items-center gap-3">
                  <ChatAvatar config={chat.photo} name={chat.name} className="group-hover:shadow-[2px_2px_0px_0px_#000] transition-shadow" />
                  <div>
                    <h4 className="font-black text-black text-lg leading-tight">{chat.name}</h4>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default NewChatModal;
