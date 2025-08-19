import ChatListItem from './ChatListItem';

import { useRef } from 'react';
import { Loader } from 'lucide-react';

const ChatList = ({ chats, activeChatId, onChatSelect, hideEmptyMessage = false, onLoadMore, hasMore, isLoadingMore }) => {
  const containerRef = useRef(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      // If we are close to the bottom (within 10px)
      if (scrollHeight - scrollTop - clientHeight < 10) {
        if (hasMore && !isLoadingMore && onLoadMore) {
          onLoadMore();
        }
      }
    }
  };
  if (!chats || chats.length === 0) {
    if (hideEmptyMessage) return null;
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-6 text-center">
        <p className="font-bold text-gray-500">No hay conversaciones activas.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto" ref={containerRef} onScroll={handleScroll}>
      {chats.map(chat => (
        <ChatListItem 
          key={chat.id} 
          chat={chat} 
          isActive={activeChatId === chat.id}
          onClick={onChatSelect}
        />
      ))}
      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <Loader className="animate-spin text-black" size={24} />
        </div>
      )}
    </div>
  );
};

export default ChatList;
