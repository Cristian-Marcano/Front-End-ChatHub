import { Search, MoreVertical } from 'lucide-react';
import ChatAvatar from '../ui/ChatAvatar';
import ChatIconButton from '../ui/ChatIconButton';

const ChatHeader = ({ activeChat, onSearch, onOptions }) => {
  if (!activeChat) {
    return <div className="h-16 border-b-4 border-black bg-white flex items-center justify-between px-4 shrink-0 relative z-10" />;
  }

  // Handle dummy vs real avatar
  const AvatarDisplay = activeChat.color 
    ? <div className={`w-10 h-10 ${activeChat.color} border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_#000] group-hover:-translate-y-1 transition-transform`}></div>
    : <ChatAvatar config={activeChat.photo} name={activeChat.name} className="shadow-[2px_2px_0px_0px_#000] group-hover:-translate-y-1 transition-transform" />;

  return (
    <div className="h-16 border-b-4 border-black bg-white flex items-center justify-between px-4 shrink-0 relative z-10">
      <div className="flex items-center gap-4 cursor-pointer group">
        {AvatarDisplay}
        <div>
          <h2 className="font-black text-black leading-tight">{activeChat.name}</h2>
          <p className="text-xs font-bold text-gray-600">{activeChat.status || 'En línea'}</p>
        </div>
      </div>
      <div className="flex gap-4">
        <ChatIconButton icon={Search} onClick={onSearch} />
        <ChatIconButton icon={MoreVertical} onClick={onOptions} />
      </div>
    </div>
  );
};

export default ChatHeader;
