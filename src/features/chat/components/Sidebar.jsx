import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../auth/services/authService';
import { profileService } from '../../profile/services/profileService';
import { useFriendshipSocket } from '../../../hooks/socket/useFriendshipSocket';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarSearch from './sidebar/SidebarSearch';
import ChatList from './sidebar/ChatList';

const Sidebar = ({ activeChatId, onChatSelect }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  
  // Use Socket Hook
  const { friendships, loadFriendships } = useFriendshipSocket();

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
    
    // Trigger socket load
    loadFriendships();
  }, [loadFriendships]);

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

  // Maps backend format to UI format, falls back to dummy if empty temporarily
  // Once fully wired, dummy chats can be removed completely.
  const mappedChats = friendships && friendships.length > 0 
    ? friendships.map(f => ({
        id: f.chatId, 
        name: f.friend_name || f.username, 
        lastMessage: f.last_message || 'Sin mensajes', 
        time: f.time || '', 
        unread: f.unread || 0,
        photo: f.photo 
      }))
    : [];

  const filteredChats = mappedChats.filter(chat => 
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-1/3 min-w-[320px] max-w-[450px] border-r-4 border-black flex flex-col bg-bg-light z-10">
      <SidebarHeader 
        userProfile={userProfile}
        onProfileClick={() => navigate('/profile')}
        onNewChat={() => console.log('New chat')}
        onOptions={() => console.log('Options')}
        onLogout={handleLogout}
      />
      <SidebarSearch 
        value={searchQuery}
        onChange={setSearchQuery}
      />
      <ChatList 
        chats={filteredChats}
        activeChatId={activeChatId}
        onChatSelect={onChatSelect}
      />
    </div>
  );
};

export default Sidebar;
