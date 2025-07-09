import { useState } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import { useGlobalSocketErrors } from '../../../hooks/socket/useGlobalSocketErrors';
import { Toast } from '../../../components/ui';

const ChatLayout = () => {
  const [activeChat, setActiveChat] = useState(null);
  const { errorMsg, setErrorMsg } = useGlobalSocketErrors();

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden relative">
      <Sidebar 
        activeChatId={activeChat?.id} 
        onChatSelect={setActiveChat} 
      />
      <ChatArea 
        activeChat={activeChat} 
      />
      <Toast message={errorMsg} type="error" onClose={() => setErrorMsg(null)} />
    </div>
  );
};

export default ChatLayout;
