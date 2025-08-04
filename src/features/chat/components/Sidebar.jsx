import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../auth/services/authService';
import { profileService } from '../../profile/services/profileService';
import { useFriendshipSocket } from '../../../hooks/socket/useFriendshipSocket';
import { useChatSocket } from '../../../hooks/socket/useChatSocket';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarSearch from './sidebar/SidebarSearch';
import ChatList from './sidebar/ChatList';
import FriendRequestsModal from './sidebar/FriendRequestsModal';
import AddFriendModal from './sidebar/AddFriendModal';

const Sidebar = ({ activeChatId, onChatSelect }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [showRequests, setShowRequests] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  
  // Sockets
  const { requests, loadRequests, acceptRequest, rejectRequest } = useFriendshipSocket();
  const { chats, loadChats } = useChatSocket(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const profile = await profileService.getProfile(token);
          setUserProfile(profile);
        }
      } catch (error) {
        if (error.response?.status === 404 || error.status === 404) {
          navigate('/setup');
        } else {
          console.error("Failed to load profile", error);
        }
      }
    };
    fetchProfile();
    
    loadChats();
    loadRequests();
  }, [loadChats, loadRequests]);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await authService.logout(refreshToken);
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  };

  const mappedChats = chats && chats.length > 0 
    ? chats.map(c => ({
        id: c.id, 
        name: c.nickname || "Usuario", 
        lastMessage: 'Sin mensajes', // Temporarily hardcoded until we parse the nested msg_text
        time: c.create_at || '', 
        unread: 0,
        photo: c.photo 
      }))
    : [];

  const localFilteredChats = mappedChats.filter(chat => 
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-1/3 min-w-[320px] max-w-[450px] border-r-4 border-black flex flex-col bg-bg-light z-10 relative">
      <SidebarHeader 
        userProfile={userProfile}
        onProfileClick={() => navigate('/settings')}
        onOptions={() => setShowRequests(true)}
        onAddFriend={() => setShowAddFriend(true)}
        onLogout={handleLogout}
        requestsCount={requests.length}
      />
      
      <SidebarSearch 
        value={searchQuery}
        onChange={setSearchQuery}
      />
      
      <div className="flex-1 overflow-y-auto">
        {searchQuery.trim() ? (
          localFilteredChats.length > 0 ? (
            <ChatList 
              chats={localFilteredChats}
              activeChatId={activeChatId}
              onChatSelect={onChatSelect}
            />
          ) : (
            <div className="p-4 text-center font-bold text-gray-500">
              No se encontraron chats con "{searchQuery}"
            </div>
          )
        ) : (
          <ChatList 
            chats={mappedChats}
            activeChatId={activeChatId}
            onChatSelect={onChatSelect}
          />
        )}
      </div>

      {showRequests && (
        <FriendRequestsModal 
          requests={requests} 
          onClose={() => setShowRequests(false)} 
          onAccept={(id) => {
             acceptRequest(id);
             setTimeout(() => loadChats(), 500); // Reload chats after accepting
          }}
          onReject={rejectRequest}
        />
      )}

      {showAddFriend && (
        <AddFriendModal 
          onClose={() => setShowAddFriend(false)} 
        />
      )}
    </div>
  );
};

export default Sidebar;
