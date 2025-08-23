import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Search, X } from 'lucide-react';
import { useSocket } from '../../../../context/SocketContext';
import { useChatSocket } from '../../../../hooks/socket/useChatSocket';
import ChatAvatar from '../ui/ChatAvatar';
import { toast } from '../../../../utils/toast';

const AddParticipantDrawer = ({ activeChat, existingMembers, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { contactSearchResults, searchContacts, hasMoreContacts, isSearchingContacts } = useChatSocket(null);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    // Initial load of contacts (empty query usually loads all or we can search for a space to get all)
    searchContacts(' ');
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchContacts(searchQuery || ' ');
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchContacts]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleMemberAdded = (data) => {
      if (data.chatId === Number(activeChat.id)) {
        toast.success('Participante(s) añadido(s) con éxito');
        onBack();
      }
    };
    
    const handleError = (data) => {
      setIsAdding(false);
      toast.error(data.error || 'Error al añadir participante');
    };

    socket.on('group:memberAdded', handleMemberAdded);
    socket.on('error:validate', handleError);
    socket.on('error:server', handleError);

    return () => {
      socket.off('group:memberAdded', handleMemberAdded);
      socket.off('error:validate', handleError);
      socket.off('error:server', handleError);
    };
  }, [socket, isConnected, activeChat.id, onBack]);

  const existingMemberIds = existingMembers.map(m => m.member_id);
  
  const filteredFriends = (contactSearchResults || [])
    .filter(f => !existingMemberIds.includes(f.friend_id))
    .map(f => ({ id: f.friend_id, name: f.nickname || '', photo: f.photo }))
    .filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const toggleFriend = (id) => {
    setSelectedFriends(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < 50 && hasMoreContacts && !isSearchingContacts) {
      searchContacts(searchQuery || ' ', true);
    }
  };

  const handleAdd = () => {
    if (selectedFriends.length === 0 || !socket || !isConnected) return;
    setIsAdding(true);
    // Since backend only accepts one memberId at a time in addMember:
    // We can emit it for each selected friend
    selectedFriends.forEach(memberId => {
       socket.emit('group:addMember', {
         chatId: Number(activeChat.id),
         memberId: memberId
       });
    });
  };

  return (
    <div className="absolute inset-0 bg-bg-light z-50 flex flex-col animate-[slideInRight_0.2s_ease-out_forwards]">
      <div className="h-16 border-b-4 border-black bg-primary flex items-center px-4 gap-4 shrink-0">
        <button onClick={onBack} className="text-white hover:scale-110 transition-transform">
          <ArrowLeft size={24} strokeWidth={3} />
        </button>
        <h2 className="font-black text-white text-lg uppercase tracking-wide">Añadir Participante</h2>
      </div>

      <div className="p-4 border-b-4 border-black bg-white shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar amigos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000] transition-all font-bold text-sm outline-none"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" strokeWidth={3} />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              <X size={16} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-bg-light" onScroll={handleScroll}>
        {filteredFriends.length > 0 ? (
          <div className="flex flex-col">
            {filteredFriends.map(friend => (
              <div 
                key={friend.id}
                onClick={() => toggleFriend(friend.id)}
                className="flex items-center gap-3 p-4 border-b-2 border-black bg-white hover:bg-yellow-100 transition-colors cursor-pointer"
              >
                <div className={`w-6 h-6 rounded-sm border-2 border-black flex items-center justify-center transition-colors ${selectedFriends.includes(friend.id) ? 'bg-primary' : 'bg-white'}`}>
                  {selectedFriends.includes(friend.id) && <Check size={16} className="text-white" strokeWidth={4} />}
                </div>
                <ChatAvatar config={friend.photo} name={friend.name} size="w-10 h-10" />
                <span className="font-bold text-black flex-1 truncate">{friend.name}</span>
              </div>
            ))}
            {isSearchingContacts && (
              <div className="p-4 text-center font-bold text-gray-500">
                Cargando...
              </div>
            )}
          </div>
        ) : !isSearchingContacts ? (
          <div className="p-8 text-center">
            <p className="font-bold text-gray-500">No hay amigos disponibles para añadir.</p>
          </div>
        ) : (
          <div className="p-8 text-center font-bold text-gray-500">
            Cargando...
          </div>
        )}
      </div>

      {selectedFriends.length > 0 && (
        <div className="p-4 border-t-4 border-black bg-white shrink-0">
          <button
            onClick={handleAdd}
            disabled={isAdding}
            className="w-full h-12 bg-primary border-4 border-black flex items-center justify-center gap-2 rounded-sm shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-black text-white uppercase tracking-wider">
              {isAdding ? 'Añadiendo...' : `Añadir (${selectedFriends.length})`}
            </span>
            <Check size={20} className="text-white" strokeWidth={3} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AddParticipantDrawer;
