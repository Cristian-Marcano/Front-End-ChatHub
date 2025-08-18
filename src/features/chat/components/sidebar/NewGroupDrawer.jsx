import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Check } from 'lucide-react';
import { InputField } from '../../../../components/ui';
import { useSocket } from '../../../../context/SocketContext';
import ChatAvatar from '../ui/ChatAvatar';

const NewGroupDrawer = ({ friends, onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleCreated = (data) => {
      setIsCreating(false);
      setTimeout(() => {
         onGroupCreated({
           id: data.chatId,
           name: data.nickname,
           chatType: 'group'
         });
      }, 200);
    };

    socket.on('group:created', handleCreated);

    return () => {
      socket.off('group:created', handleCreated);
    };
  }, [socket, isConnected, onGroupCreated]);

  const toggleFriend = (friendId) => {
    // Fallback just in case friendId is missing/undefined in database, use id
    if (!friendId) return; 
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 200);
  };

  const handleCreate = () => {
    if (!groupName.trim() || selectedFriends.length === 0 || !socket) return;
    setIsCreating(true);
    socket.emit('group:create', {
      nickname: groupName.trim(),
      members: selectedFriends
    });
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
          <h2 className="text-xl font-black uppercase">Nuevo Grupo</h2>
        </div>
      </div>

      <div className="p-4 border-b-4 border-black bg-gray-50 shrink-0">
        <InputField 
          type="text"
          placeholder="Nombre del grupo..."
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        
        <button 
          onClick={handleCreate}
          disabled={isCreating || !groupName.trim() || selectedFriends.length === 0}
          className="w-full mt-4 bg-black text-white p-3 font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary transition-colors flex justify-center border-2 border-transparent hover:border-black"
        >
          {isCreating ? 'Creando...' : 'Crear Grupo'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white flex flex-col">
        {friends.length === 0 ? (
          <div className="text-center p-8 font-bold text-gray-500">
            No tienes amigos disponibles.
          </div>
        ) : (
          friends.map(friend => {
            // Use friendId or id as fallback for selection
            const fId = friend.friendId || friend.id;
            const isSelected = selectedFriends.includes(fId);
            return (
              <div 
                key={friend.id} 
                onClick={() => toggleFriend(fId)}
                className={`flex items-center gap-3 p-4 border-b-2 border-black transition-colors cursor-pointer group ${isSelected ? 'bg-primary/10' : 'hover:bg-yellow-200'}`}
              >
                <ChatAvatar config={friend.photo} name={friend.name} className="group-hover:shadow-[2px_2px_0px_0px_#000] transition-shadow" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-black text-lg leading-tight truncate">{friend.name}</h4>
                </div>
                <div className={`w-6 h-6 border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-primary bg-primary' : 'border-black bg-white'}`}>
                  {isSelected && <Check size={16} className="text-white" strokeWidth={4} />}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NewGroupDrawer;
