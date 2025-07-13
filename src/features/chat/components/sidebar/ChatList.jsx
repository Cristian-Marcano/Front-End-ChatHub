import ChatListItem from './ChatListItem';

const ChatList = ({ chats, activeChatId, onChatSelect, hideEmptyMessage = false }) => {
  if (!chats || chats.length === 0) {
    if (hideEmptyMessage) return null;
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-6 text-center">
        <p className="font-bold text-gray-500">No hay conversaciones activas.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map(chat => (
        <ChatListItem 
          key={chat.id} 
          chat={chat} 
          isActive={activeChatId === chat.id}
          onClick={onChatSelect}
        />
      ))}
    </div>
  );
};

export default ChatList;
