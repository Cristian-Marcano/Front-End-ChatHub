import { useChatSocket } from '../../../hooks/socket/useChatSocket';
import ChatHeader from './chat-area/ChatHeader';
import MessageList from './chat-area/MessageList';
import MessageInput from './chat-area/MessageInput';
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const ChatArea = ({ activeChat, currentUserId }) => {
  const { messages, searchResults, isSearching, hasMoreHistory, isLoadingMore, loadMoreHistory, searchMessages, loadContext, reloadHistory, sendMessage, setTyping, isContactTyping } = useChatSocket(activeChat?.id);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightMessageId, setHighlightMessageId] = useState(null);
  
  const isBlocked = activeChat?.chatType === 'private' && (activeChat.primary_state === 'blocked' || activeChat.secondary_state === 'blocked');
  const didIBlock = activeChat?.chatType === 'private' && (
    (activeChat.primary_user_id === currentUserId && activeChat.primary_state === 'blocked') || 
    (activeChat.primary_user_id !== currentUserId && activeChat.secondary_state === 'blocked')
  );
  console.log("activeChat:", activeChat, "currentUserId:", currentUserId, "didIBlock:", didIBlock);

  useEffect(() => {
    setShowSearch(false);
    setSearchQuery('');
    setHighlightMessageId(null);
  }, [activeChat?.id]);

  
  useEffect(() => {
    const handler = setTimeout(() => {
      if (showSearch) {
        searchMessages(searchQuery);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, showSearch, searchMessages]);


  const handleSendMessage = (content) => {
    sendMessage(content);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#e5e5f7] relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
      
      {activeChat ? (
        <div className="flex-1 flex w-full relative z-10 overflow-hidden">
          {/* Main Chat Column */}
          <div className="flex-1 flex flex-col h-full bg-transparent">
            <ChatHeader 
              activeChat={activeChat}
              isTyping={isContactTyping}
              onSearch={() => setShowSearch(!showSearch)}
              didIBlock={didIBlock}
                          />
            
            
            {/* Banner for older context */}
            {highlightMessageId && (
              <div className="bg-yellow-200 border-b-4 border-black p-2 flex justify-between items-center z-10 px-4 shrink-0 shadow-md">
                <span className="font-bold text-sm text-black uppercase tracking-wide">Viendo mensaje buscado</span>
                <button 
                  onClick={() => { setHighlightMessageId(null); reloadHistory(); }}
                  className="bg-white border-2 border-black px-3 py-1 text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all cursor-pointer"
                >
                  VOLVER A RECIENTES
                </button>
              </div>
            )}
            
            {/* Si estamos viendo contexto (menos mensajes o mensajes saltados), mostramos botón para volver al fondo */}

            <div className="flex-1 overflow-hidden flex flex-col relative">
              <MessageList 
                messages={messages}
                currentUserId={currentUserId}
                chatType={activeChat?.chatType} 
                highlightMessageId={highlightMessageId}
                hasMoreHistory={hasMoreHistory}
                isLoadingMore={isLoadingMore}
                onLoadMore={loadMoreHistory}
              />
            </div>
            

            {isBlocked ? (
              <div className="bg-gray-200 border-t-4 border-black p-4 text-center font-bold text-gray-600">
                Este chat ha sido bloqueado y no permite enviar más mensajes.
              </div>
            ) : (
              <MessageInput 
                onSend={handleSendMessage}
                onTyping={setTyping}
                disabled={!activeChat}
              />
            )}
          </div>


          {/* Search Sidebar Column */}
          {showSearch && (
            <div className="w-80 border-l-4 border-black bg-white flex flex-col shrink-0 relative z-20 shadow-[-4px_0px_0px_0px_rgba(0,0,0,0.1)]">
              <div className="h-16 border-b-4 border-black flex items-center gap-2 px-4 shrink-0">
                <Search size={20} className="text-black" strokeWidth={3} />
                <h3 className="font-black text-black uppercase tracking-wide flex-1">Buscar</h3>
                <button onClick={() => { setShowSearch(false); setSearchQuery(''); reloadHistory(); setHighlightMessageId(null); }} className="hover:bg-gray-200 p-1 rounded-sm cursor-pointer">
                  <X size={24} className="text-black" strokeWidth={3} />
                </button>
              </div>
              
              <div className="p-4 border-b-4 border-black shrink-0">
                <input 
                  type="text" 
                  placeholder="Buscar mensaje..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full h-10 px-3 outline-none border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000] transition-all font-bold text-sm bg-gray-50"
                />
              </div>

              <div className="flex-1 overflow-y-auto bg-bg-light p-2">
                {isSearching ? (
                  <p className="text-center font-bold p-4 text-gray-500">Buscando...</p>
                ) : searchResults.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {searchResults.map(res => (
                      <div 
                        key={res.id} 
                        onClick={() => { setHighlightMessageId(res.id); loadContext(res.id); }}
                        className="bg-white border-2 border-black rounded-sm p-3 cursor-pointer hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] transition-all"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-xs uppercase text-primary truncate pr-2">{res.username}</span>
                          <span className="text-[10px] font-bold text-gray-500 shrink-0">{new Date(res.create_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm font-semibold text-black line-clamp-2 leading-tight">{res.msg_text}</p>
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <p className="text-center font-bold p-4 text-gray-500">No hay resultados</p>
                ) : (
                  <p className="text-center font-bold p-4 text-gray-500 text-sm">Escribe para buscar en este chat</p>
                )}
              </div>
            </div>
          )}
        </div>
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
