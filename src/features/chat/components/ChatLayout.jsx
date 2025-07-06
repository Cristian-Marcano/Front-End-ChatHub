import { useState } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

const ChatLayout = () => {
  const [activeChat, setActiveChat] = useState(null);

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
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
