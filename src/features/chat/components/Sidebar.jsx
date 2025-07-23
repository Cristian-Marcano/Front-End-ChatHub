import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../auth/services/authService';
import { profileService } from '../../profile/services/profileService';
import { useFriendshipSocket } from '../../../hooks/socket/useFriendshipSocket';
import { useUserSocket } from '../../../hooks/socket/useUserSocket';
import { useChatSocket } from '../../../hooks/socket/useChatSocket';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarSearch from './sidebar/SidebarSearch';
import ChatList from './sidebar/ChatList';
import FriendRequestsModal from './sidebar/FriendRequestsModal';

const Sidebar = ({ activeChatId, onChatSelect }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [showRequests, setShowRequests] = useState(false);
  
  // Sockets
  const { requests, loadRequests, sendRequest, acceptRequest, rejectRequest } = useFriendshipSocket();
  const { searchResults, searchUsers, isSearching } = useUserSocket();
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
        console.error("Failed to load profile", error);
      }
    };
    fetchProfile();
    
    loadChats();
    loadRequests();
  }, [loadChats, loadRequests]);

  // Handle Debounced Search
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      searchUsers(searchQuery);
    }
  }, [searchQuery, searchUsers]);

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
        onProfileClick={() => navigate('/profile')}
        onOptions={() => setShowRequests(true)} // Open requests on options click for now
        onLogout={handleLogout}
        requestsCount={requests.length}
      />
      
      <SidebarSearch 
        value={searchQuery}
        onChange={setSearchQuery}
      />
      
      {/* Search Layout */}
      {searchQuery.trim() ? (
        <div className="flex-1 overflow-y-auto">
          {localFilteredChats.length > 0 && (
             <div>
               <div className="bg-gray-200 border-b-2 border-y-2 border-black px-3 py-1 text-xs font-black">Tus Chats</div>
               <ChatList 
                 chats={localFilteredChats}
                 activeChatId={activeChatId}
                 onChatSelect={onChatSelect}
                 hideEmptyMessage={true}
               />
             </div>
          )}
          
          <div>
            <div className="bg-gray-200 border-b-2 border-y-2 border-black px-3 py-1 text-xs font-black">Búsqueda Global</div>
            {isSearching ? (
              <div className="p-4 text-center font-bold text-gray-500">Buscando...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map(user => (
                 <div key={user.id} className="flex items-center justify-between p-3 border-b-2 border-black hover:bg-white transition-colors">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-blue-300 border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_#000]"></div>
                     <div>
                       <p className="font-bold text-black">{user.username}</p>
                       <p className="text-xs text-gray-600">{user.email}</p>
                     </div>
                   </div>
                   <button 
                     onClick={() => sendRequest(user.id)}
                     className="bg-primary text-white text-xs font-bold px-3 py-1 border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
                   >
                     Añadir
                   </button>
                 </div>
              ))
            ) : (
              <div className="p-4 text-center font-bold text-gray-500">No se encontraron usuarios.</div>
            )}
          </div>
        </div>
      ) : (
        <ChatList 
          chats={mappedChats}
          activeChatId={activeChatId}
          onChatSelect={onChatSelect}
        />
      )}

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
    </div>
  );
};

export default Sidebar;
