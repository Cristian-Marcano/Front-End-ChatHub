import { useState, useRef, useEffect } from 'react';
import { Search, MoreVertical, LogOut, Ban, Unlock } from 'lucide-react';
import ChatAvatar from '../ui/ChatAvatar';
import ChatIconButton from '../ui/ChatIconButton';
import { useSocket } from '../../../../context/SocketContext';

const ChatHeader = ({ activeChat, isTyping, onSearch, didIBlock }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const { socket } = useSocket();

  // Handle clicking outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  if (!activeChat) {
    return <div className="h-16 border-b-4 border-black bg-white flex items-center justify-between px-4 shrink-0 relative z-50" />;
  }

  // Handle dummy vs real avatar
  const AvatarDisplay = activeChat.color 
    ? <div className={`w-10 h-10 ${activeChat.color} border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_#000] group-hover:-translate-y-1 transition-transform`}></div>
    : <ChatAvatar config={activeChat.photo} name={activeChat.name} className="shadow-[2px_2px_0px_0px_#000] group-hover:-translate-y-1 transition-transform" />;

  const handleAction = (action) => {
    console.log("CLICKED ACTION:", action);
    setShowMenu(false);
    if (!socket) return;

    if (action === 'unblock') {
      socket.emit('friendship:unblock', { chatId: Number(activeChat.id) });
      return;
    }
    if (action === 'leave_group') {
      socket.emit('group:leave', { chatId: Number(activeChat.id) });
      // The reload of chats should be handled by listening to group:left or similar.
      // We will add a listener in useChatSocket.js if needed.
    } else if (action === 'block_user') {
      // Future block functionality
      // socket.emit('user:block', { friendId: activeChat.friendId });
      socket.emit('friendship:block', { chatId: Number(activeChat.id) });
      setTimeout(() => window.location.reload(), 300); // Give socket time to emit before reload // Quick refresh to update the list and remove the chat
    }
  };

  return (
    <div className="h-16 border-b-4 border-black bg-white flex items-center justify-between px-4 shrink-0 relative z-50">
      <div className="flex items-center gap-4 cursor-pointer group">
        {AvatarDisplay}
        <div>
          <h2 className="font-black text-black leading-tight">{activeChat.name}</h2>
          <p className={`text-xs font-bold ${isTyping ? 'text-primary animate-pulse' : 'text-gray-600'}`}>
            {isTyping ? 'Escribiendo...' : (activeChat.status || 'En línea')}
          </p>
        </div>
      </div>
      
      <div className="flex gap-4 items-center">
        <ChatIconButton icon={Search} onClick={onSearch} />
        
        <div className="relative" ref={menuRef}>
          <ChatIconButton 
            icon={MoreVertical} 
            onClick={() => setShowMenu(!showMenu)} 
            isActive={showMenu}
          />
          
          {showMenu && (
            <div className="absolute right-0 top-12 w-48 bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col py-2 z-50 animate-in fade-in slide-in-from-top-2">
              {activeChat.chatType === 'group' ? (
                <button 
                  onMouseDown={() => handleAction('leave_group')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-bold hover:bg-red-50 hover:pl-6 transition-all border-l-4 border-transparent hover:border-red-600"
                >
                  <LogOut size={18} strokeWidth={3} />
                  <span>Salir del grupo</span>
                </button>
              ) : didIBlock ? (
                <button 
                  onMouseDown={() => { handleAction('unblock'); setTimeout(() => window.location.reload(), 300); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-yellow-600 font-bold hover:bg-yellow-50 hover:pl-6 transition-all border-l-4 border-transparent hover:border-yellow-600"
                >
                  <Unlock size={18} strokeWidth={3} />
                  <span>Desbloquear usuario</span>
                </button>
              ) : (
                <button 
                  onMouseDown={() => handleAction('block_user')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-bold hover:bg-red-50 hover:pl-6 transition-all border-l-4 border-transparent hover:border-red-600"
                >
                  <Ban size={18} strokeWidth={3} />
                  <span>Bloquear usuario</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
