import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, UserPlus, Settings2, MoreVertical, Ban, ShieldAlert, ShieldX, UserMinus } from 'lucide-react';
import ChatAvatar from '../ui/ChatAvatar';
import AddParticipantDrawer from './AddParticipantDrawer';
import { useSocket } from '../../../../context/SocketContext';

const GroupDetailsDrawer = ({ activeChat, currentUserId, onClose }) => {
  const drawerRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const [members, setMembers] = useState([]);
  const [isClosing, setIsClosing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [onlyAdminsAdd, setOnlyAdminsAdd] = useState(activeChat.add_user_permission === 'admin');
  const { socket, isConnected } = useSocket();
  const [activeMemberMenu, setActiveMemberMenu] = useState(null);
  const [showAddParticipant, setShowAddParticipant] = useState(false);

  useEffect(() => {
    if (!socket || !isConnected || !activeChat) return;

    socket.emit('group:getMembers', { chatId: Number(activeChat.id) });

    const handleMembersList = (data) => {
      if (data.chatId === Number(activeChat.id)) {
        setMembers(data.members);
      }
    };

    const handleRoleUpdated = (data) => {
      if (data.chatId === Number(activeChat.id)) {
        setMembers(prev => prev.map(m => m.member_id === data.memberId ? { ...m, role: data.role } : m));
      }
    };

    const handleMemberKicked = (data) => {
      if (data.chatId === Number(activeChat.id)) {
        setMembers(prev => prev.filter(m => m.member_id !== data.memberId));
      }
    };
    
    const handleSettingsUpdated = (data) => {
      if (data.chatId === Number(activeChat.id)) {
        setOnlyAdminsAdd(data.add_user_permission === 'admin');
      }
    };
    
    const handleMemberAdded = (data) => {
      if (data.chatId === Number(activeChat.id)) {
        // Refetch members
        socket.emit('group:getMembers', { chatId: Number(activeChat.id) });
      }
    };

    socket.on('group:membersList', handleMembersList);
    socket.on('group:roleUpdated', handleRoleUpdated);
    socket.on('group:memberKicked', handleMemberKicked);
    socket.on('group:settingsUpdated', handleSettingsUpdated);
    socket.on('group:memberAdded', handleMemberAdded);

    return () => {
      socket.off('group:memberAdded', handleMemberAdded);
      socket.off('group:membersList', handleMembersList);
      socket.off('group:roleUpdated', handleRoleUpdated);
      socket.off('group:memberKicked', handleMemberKicked);
      socket.off('group:settingsUpdated', handleSettingsUpdated);
    };
  }, [socket, isConnected, activeChat]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 200);
  };

  const toggleSettings = () => {
    const newVal = !onlyAdminsAdd;
    setOnlyAdminsAdd(newVal);
    socket.emit('group:updateSettings', {
      chatId: Number(activeChat.id),
      add_user_permission: newVal ? 'admin' : 'all'
    });
  };
  
  const handleAction = (action, targetId) => {
    setActiveMemberMenu(null);
    if (action === 'kick') {
      socket.emit('group:kickMember', { chatId: Number(activeChat.id), targetId });
    } else if (action === 'make_admin') {
      socket.emit('group:updateRole', { chatId: Number(activeChat.id), targetId, newRole: 'admin' });
    } else if (action === 'remove_admin') {
      socket.emit('group:updateRole', { chatId: Number(activeChat.id), targetId, newRole: 'member' });
    }
  };

  const myRole = members.find(m => m.member_id === currentUserId)?.role || 'member';
  const canChangeSettings = myRole === 'owner' || myRole === 'admin';
  const canAddUsers = onlyAdminsAdd ? canChangeSettings : true;

  return (
    <div ref={drawerRef} className={`absolute inset-0 bg-white z-40 flex flex-col ${isClosing ? 'animate-[slideOutRight_0.2s_ease-in_forwards]' : 'animate-[slideInRight_0.2s_ease-out_forwards]'}`}>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
      `}</style>
      
      <div className="h-16 bg-primary border-b-4 border-black flex items-center px-4 shrink-0 justify-between">
        <div className="flex items-center gap-4 text-white">
          <button 
            onClick={handleClose}
            className="hover:bg-black/20 p-2 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={24} strokeWidth={3} />
          </button>
          <h2 className="text-xl font-black uppercase truncate">
            Info del Grupo
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="flex flex-col items-center justify-center p-6 mb-4">
          <ChatAvatar config={activeChat.photo} name={activeChat.name} size="w-24 h-24" className="text-4xl shadow-[4px_4px_0px_0px_#000] border-4 mb-4" />
          <h2 className="text-2xl font-black text-black text-center">{activeChat.name}</h2>
          <p className="font-bold text-gray-500 uppercase tracking-widest">{members.length} participantes</p>
        </div>

        {canChangeSettings && (
          <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings2 size={24} className="text-black" strokeWidth={3} />
                <div>
                  <h3 className="font-black uppercase">Solo Admins pueden añadir</h3>
                  <p className="text-sm font-bold text-gray-500">Restringir nuevos miembros</p>
                </div>
              </div>
              <button 
                onClick={toggleSettings}
                className={`w-12 h-6 rounded-full border-2 border-black transition-colors relative flex items-center ${onlyAdminsAdd ? 'bg-primary' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-black mx-1 transition-transform ${onlyAdminsAdd ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        )}

        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] overflow-visible relative">
          {canAddUsers && (
            <button onClick={() => setShowAddParticipant(true)} className="w-full flex items-center gap-4 p-4 border-b-2 border-black hover:bg-yellow-200 transition-colors text-left group">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center border-2 border-black group-hover:scale-110 transition-transform">
                <UserPlus size={24} className="text-white" strokeWidth={3} />
              </div>
              <span className="font-black uppercase text-lg">Añadir Participante</span>
            </button>
          )}

          {members.map(member => (
            <div key={member.member_id} className="flex items-center gap-3 p-4 border-b-2 border-black last:border-b-0 relative group">
              <ChatAvatar config={member.photo} name={member.full_name} size="w-12 h-12" />
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-black leading-tight truncate">{member.full_name}</h4>
                {member.role !== 'member' && (
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border-2 border-black text-white inline-block mt-1 ${member.role === 'owner' ? 'bg-red-500' : 'bg-blue-500'}`}>
                    {member.role === 'owner' ? 'Propietario' : 'Admin'}
                  </span>
                )}
              </div>
              
              {myRole !== 'member' && member.member_id !== currentUserId && member.role !== 'owner' && (
                <div className="relative">
                  <button 
                    onClick={() => setActiveMemberMenu(activeMemberMenu === member.member_id ? null : member.member_id)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                  >
                    <MoreVertical size={20} strokeWidth={3} className="text-black" />
                  </button>
                  
                  {activeMemberMenu === member.member_id && (
                    <div className="absolute right-0 top-10 w-56 bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col py-2 z-50 animate-in zoom-in-95 origin-top-right">
                      {myRole === 'owner' && (
                        member.role === 'member' ? (
                          <button 
                            onClick={() => handleAction('make_admin', member.member_id)}
                            className="w-full flex items-center gap-3 px-4 py-3 font-bold hover:bg-blue-50 hover:pl-6 transition-all text-blue-600 border-l-4 border-transparent hover:border-blue-600"
                          >
                            <ShieldAlert size={18} strokeWidth={3} />
                            <span>Hacer Administrador</span>
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleAction('remove_admin', member.member_id)}
                            className="w-full flex items-center gap-3 px-4 py-3 font-bold hover:bg-yellow-50 hover:pl-6 transition-all text-yellow-600 border-l-4 border-transparent hover:border-yellow-600"
                          >
                            <ShieldX size={18} strokeWidth={3} />
                            <span>Quitar de Administrador</span>
                          </button>
                        )
                      )}
                      
                      {((myRole === 'owner') || (myRole === 'admin' && member.role === 'member')) && (
                        <button 
                          onClick={() => handleAction('kick', member.member_id)}
                          className="w-full flex items-center gap-3 px-4 py-3 font-bold hover:bg-red-50 hover:pl-6 transition-all text-red-600 border-l-4 border-transparent hover:border-red-600"
                        >
                          <UserMinus size={18} strokeWidth={3} />
                          <span>Expulsar del Grupo</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {showAddParticipant && (
        <AddParticipantDrawer 
          activeChat={activeChat}
          existingMembers={members}
          onBack={() => setShowAddParticipant(false)}
        />
      )}
    </div>
  );
};

export default GroupDetailsDrawer;
