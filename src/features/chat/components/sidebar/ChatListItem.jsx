import UnreadBadge from '../ui/UnreadBadge';
import ChatAvatar from '../ui/ChatAvatar';

const ChatListItem = ({ chat, isActive, onClick }) => {
  // Determine if it's a dummy color block or an avatar
  const AvatarDisplay = chat.color 
    ? <div className={`w-12 h-12 ${chat.color} border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_#000] shrink-0 mr-4 group-hover:-translate-y-1 transition-transform`}></div>
    : <ChatAvatar config={chat.photo} name={chat.name} className="w-12 h-12 shadow-[2px_2px_0px_0px_#000] mr-4 group-hover:-translate-y-1 transition-transform" />;

  return (
    <div 
      onClick={() => onClick(chat)}
      className={`flex items-center p-3 border-b-2 border-black cursor-pointer transition-colors group ${isActive ? 'bg-primary text-white' : 'hover:bg-white text-black'}`}
    >
      {AvatarDisplay}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className={`font-bold truncate ${isActive ? 'text-white' : 'text-black'}`}>{chat.name}</h3>
          <span className={`text-xs font-black ml-2 ${isActive ? 'text-blue-100' : 'text-gray-600'}`}>{chat.time}</span>
        </div>
        <div className="flex justify-between items-center">
          <p className={`text-sm font-semibold truncate ${isActive ? 'text-blue-50' : 'text-gray-600'}`}>{chat.lastMessage}</p>
          <UnreadBadge count={chat.unread} className="ml-2" />
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
