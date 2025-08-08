import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { isSameDay, formatChatDateSeparator } from '../../../../utils/dateFormatter';

const MessageList = ({ messages, currentUserId }) => {
  const bottomRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center items-center relative z-10">
        <div className="bg-white border-4 border-black p-4 rounded-sm shadow-[4px_4px_0px_0px_#000] text-center">
          <p className="font-bold text-black">Aún no hay mensajes.</p>
          <p className="text-sm font-semibold text-gray-600">¡Sé el primero en saludar!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 relative z-10">
      {messages.map((msg, index) => {
        const prevMsg = messages[index - 1];
        const showDateSeparator = !prevMsg || !isSameDay(msg.create_at, prevMsg.create_at);

        return (
          <div key={msg.id} className="flex flex-col gap-4">
            {showDateSeparator && (
              <div className="flex justify-center my-2">
                <span className="bg-white border-2 border-black px-3 py-1 text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000] rounded-sm uppercase tracking-wide">
                  {formatChatDateSeparator(msg.create_at)}
                </span>
              </div>
            )}
            <MessageBubble 
              message={msg} 
              isSentByMe={msg.user_sending_id === currentUserId} 
            />
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
