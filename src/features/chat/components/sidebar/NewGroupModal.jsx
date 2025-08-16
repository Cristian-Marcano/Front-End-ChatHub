import { useState, useCallback, useEffect } from 'react';
import { X, Users, Check } from 'lucide-react';
import { useSocket } from '../../../../context/SocketContext';
import ChatAvatar from '../ui/ChatAvatar';

const NewGroupModal = ({ friends, onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const { socket, isConnected } = useSocket();

  // Listen to group creation response
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleCreated = (data) => {
      setIsCreating(false);
      // Wait a tiny bit to ensure the socket joined the room in backend
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
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
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
    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col p-6 animate-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-black uppercase flex items-center">
          <Users className="mr-2" size={24} />
          Crear Grupo
        </h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-black hover:text-white transition-colors rounded-sm"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mb-4">
        <input 
          type="text" 
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Nombre del grupo..."
          className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-shadow rounded-sm placeholder:text-gray-400"
          autoFocus
        />
      </div>

      <h3 className="font-bold text-sm text-gray-500 uppercase mb-3 mt-2">
        Añadir miembros ({selectedFriends.length})
      </h3>

      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-2">
        {friends.length === 0 ? (
          <p className="text-center font-bold text-gray-400 mt-4">
            No tienes amigos disponibles para agregar.
          </p>
        ) : (
          friends.map(friend => {
            const isSelected = selectedFriends.includes(friend.id);
            // Notice friend.id is actually chatId of the private chat. Wait! 
            // The user schema requires the user ID, not the chat ID!
            // Wait, we don't have the user ID of the friend in the 'mappedChats'.
            // Mapped chats only contain chatId, name, photo, etc.
            // Oh no! We need to add 'userId' to mappedChats for private chats!
            return (
              <div 
                key={friend.id}
                onClick={() => toggleFriend(friend.friendId)}
                className={`flex items-center p-3 border-2 border-black rounded-sm cursor-pointer transition-all ${
                  isSelected ? 'bg-primary text-white shadow-[2px_2px_0px_0px_#000] -translate-y-0.5' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <ChatAvatar config={friend.photo} name={friend.name} className="w-8 h-8 mr-3 shadow-[1px_1px_0px_0px_#000]" />
                <span className="font-bold flex-1">{friend.name}</span>
                <div className={`w-5 h-5 border-2 ${isSelected ? 'border-white bg-black flex items-center justify-center' : 'border-black'}`}>
                  {isSelected && <Check size={14} className="text-white" strokeWidth={4} />}
                </div>
              </div>
            );
          })
        )}
      </div>

      <button 
        onClick={handleCreate}
        disabled={isCreating || !groupName.trim() || selectedFriends.length === 0}
        className="w-full mt-4 bg-black text-white p-4 font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary transition-colors flex justify-center"
      >
        {isCreating ? 'Creando...' : 'Crear Grupo'}
      </button>
    </div>
  );
};

export default NewGroupModal;
