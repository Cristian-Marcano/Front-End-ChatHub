import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../auth/services/authService';
import { profileService } from '../../profile/services/profileService';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarSearch from './sidebar/SidebarSearch';
import ChatList from './sidebar/ChatList';

const Sidebar = ({ activeChatId, onChatSelect }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState(null);

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
  }, []);

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

  const dummyChats = [
    { id: 1, name: 'Alice', lastMessage: 'Hola, ¿cómo estás?', time: '10:45 AM', unread: 2, color: 'bg-pink-400' },
    { id: 2, name: 'Bob', lastMessage: 'No te olvides de la reunión.', time: 'Ayer', unread: 0, color: 'bg-blue-400' },
    { id: 3, name: 'Charlie', lastMessage: 'Jajaja, sí 😅', time: 'Ayer', unread: 0, color: 'bg-green-400' },
  ];

  const filteredChats = dummyChats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
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
