import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import { useGlobalSocketErrors } from '../../../hooks/socket/useGlobalSocketErrors';
import { profileService } from '../../profile/services/profileService';

const ChatLayout = () => {
  const navigate = useNavigate();
  const [activeChat, setActiveChat] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  
  useGlobalSocketErrors();

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
  }, [navigate]);

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden relative">
      <Sidebar 
        activeChatId={activeChat?.id} 
        onChatSelect={setActiveChat} 
        userProfile={userProfile}
      />
      <ChatArea 
        activeChat={activeChat} 
        currentUserId={userProfile?.id}
      />
      </div>
  );
};

export default ChatLayout;
