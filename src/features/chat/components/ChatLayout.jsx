import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

const ChatLayout = () => {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      <Sidebar />
      <ChatArea />
    </div>
  );
};

export default ChatLayout;
