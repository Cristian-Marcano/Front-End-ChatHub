import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Check, Search, X } from 'lucide-react';
import { InputField } from '../../../../components/ui';
import { useSocket } from '../../../../context/SocketContext';
import { useChatSocket } from '../../../../hooks/socket/useChatSocket';
import ChatAvatar from '../ui/ChatAvatar';

const NewGroupDrawer = ({ friends: initialFriends, onClose, onGroupCreated }) => {
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { contactSearchResults, searchContacts, isSearchingContacts, hasMoreContacts } = useChatSocket(null);
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    // Initial load
    searchContacts(' ');
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchContacts(searchQuery || ' ');
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchContacts]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < 50 && hasMoreContacts && !isSearchingContacts) {
      searchContacts(searchQuery || ' ', true);
    }
  };

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

  const displayFriends = searchQuery.trim() 
    ? contactSearchResults.map(c => ({
        id: c.id,
        name: c.nickname || c.group_name,
        photo: c.photo,
        chatType: c.group_name ? 'group' : 'private',
        friendId: c.friend_id
      })).filter(c => c.chatType === 'private')
    : initialFriends;

  const toggleFriend = (friend) => {
    const fId = friend.friendId || friend.id;
    if (!fId) return; 
    setSelectedFriends(prev => 
      prev.some(f => (f.friendId || f.id) === fId) 
        ? prev.filter(f => (f.friendId || f.id) !== fId)
        : [...prev, friend]
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
      members: selectedFriends.map(f => f.friendId || f.id)
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
            onClick={() => step === 2 ? setStep(1) : handleClose()}
            className="hover:bg-black/20 p-2 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={24} strokeWidth={3} />
          </button>
          <h2 className="text-xl font-black uppercase">
            {step === 1 ? 'Añadir Amigos' : 'Nuevo Grupo'}
          </h2>
        </div>
      </div>

      {step === 1 ? (
        <>
          <div className="p-4 border-b-4 border-black bg-gray-50 shrink-0">
            <div className="relative">
              <InputField 
                type="text"
                placeholder="Buscar amigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold" strokeWidth={3} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white flex flex-col relative pb-24" onScroll={handleScroll}>
            {displayFriends.length === 0 && !isSearchingContacts ? (
              <div className="text-center p-8 font-bold text-gray-500">
                No tienes amigos disponibles.
              </div>
            ) : (
              <>
                {displayFriends.map(friend => {
                  const fId = friend.friendId || friend.id;
                  const isSelected = selectedFriends.some(f => (f.friendId || f.id) === fId);
                return (
                  <div 
                    key={friend.id} 
                    onClick={() => toggleFriend(friend)}
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
              })}
              {isSearchingContacts && (
                <div className="p-4 text-center font-bold text-gray-500">
                  Cargando...
                </div>
              )}
            </>
            )}
          </div>

          {selectedFriends.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t-4 border-black">
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-black text-white p-3 font-black uppercase tracking-widest hover:bg-primary transition-colors flex justify-center border-2 border-transparent hover:border-black"
              >
                Continuar ({selectedFriends.length})
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 flex flex-col overflow-y-auto bg-gray-50 p-4">
          <div className="mb-6">
            <h3 className="font-black text-black uppercase mb-2">Nombre del Grupo</h3>
            <InputField 
              type="text"
              placeholder="Ej: Los del barrio..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div className="mb-6 flex-1 overflow-hidden flex flex-col">
            <h3 className="font-black text-black uppercase mb-2">Participantes ({selectedFriends.length})</h3>
            <div className="flex-1 overflow-y-auto bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000]">
              {selectedFriends.map(friend => (
                <div key={friend.id} className="flex items-center gap-3 p-3 border-b-2 border-black last:border-b-0">
                  <ChatAvatar config={friend.photo} name={friend.name} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-black leading-tight truncate">{friend.name}</h4>
                  </div>
                  <button 
                    onClick={() => toggleFriend(friend)}
                    className="p-1 hover:bg-red-100 text-red-500 rounded-full transition-colors cursor-pointer"
                  >
                    <X size={20} strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleCreate}
            disabled={isCreating || !groupName.trim() || selectedFriends.length === 0}
            className="w-full mt-auto bg-black text-white p-3 font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary transition-colors flex justify-center border-2 border-transparent hover:border-black shadow-[4px_4px_0px_0px_#000]"
          >
            {isCreating ? 'Creando...' : !groupName.trim() ? 'Escribe un nombre' : 'Crear Grupo'}
          </button>
        </div>
      )}
    </div>
  );
};

export default NewGroupDrawer;
