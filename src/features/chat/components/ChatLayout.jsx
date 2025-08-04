import { useState } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import { useGlobalSocketErrors } from '../../../hooks/socket/useGlobalSocketErrors';

const ChatLayout = () => {
  const [activeChat, setActiveChat] = useState(null);
  useGlobalSocketErrors();

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden relative">
      <Sidebar 
        activeChatId={activeChat?.id} 
        onChatSelect={setActiveChat} 
      />
      <ChatArea 
        activeChat={activeChat} 
      />
      </div>
  );
};

export default ChatLayout;
