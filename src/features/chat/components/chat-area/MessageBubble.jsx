const MessageBubble = ({ message, isSentByMe }) => {
  const alignClass = isSentByMe ? 'self-end' : 'self-start';
  const bgClass = isSentByMe ? 'bg-green-400' : 'bg-white';
  const textClass = 'text-black';
  const timeClass = isSentByMe ? 'text-gray-800' : 'text-gray-500';

  return (
    <div className={`${alignClass} max-w-[75%]`}>
      <div className={`${bgClass} border-4 border-black p-3 rounded-sm shadow-[4px_4px_0px_0px_#000]`}>
        <p className={`font-bold ${textClass} text-base`}>{message.content}</p>
        <span className={`text-[10px] ${timeClass} font-black block text-right mt-1`}>
          {message.time} {isSentByMe && (message.status === 'read' ? '✓✓' : '✓')}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
