import ChatAvatar from '../ui/ChatAvatar';

const MessageBubble = ({ message, isSentByMe, showSenderInfo }) => {
  const alignClass = isSentByMe ? 'self-end' : 'self-start';
  const bgClass = isSentByMe ? 'bg-green-400' : 'bg-white';
  const textClass = 'text-black';
  const timeClass = isSentByMe ? 'text-gray-800' : 'text-gray-500';

  const formattedTime = message.create_at 
    ? new Date(message.create_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  const senderName = message.nickname || message.username || 'Usuario';

  return (
    <div className={`${alignClass} max-w-[75%]`}>
      {showSenderInfo && (
        <div className="flex items-center gap-2 mb-1 ml-1">
          <ChatAvatar config={message.photo} name={senderName} className="w-5 h-5 shadow-none" />
          <span className="text-xs font-black text-gray-700 truncate">{senderName}</span>
        </div>
      )}
      <div className={`${bgClass} border-4 border-black p-3 rounded-sm shadow-[4px_4px_0px_0px_#000]`}>
        <p className={`font-bold ${textClass} text-base break-words`}>{message.msg_text}</p>
        <span className={`text-[10px] ${timeClass} font-black block text-right mt-1`}>
          {formattedTime} {isSentByMe && (
            <span className={message.status === 'read' ? 'text-blue-600' : 'text-gray-500'}>
              {message.status === 'read' ? '✓✓' : '✓'}
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
