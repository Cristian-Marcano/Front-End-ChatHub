import ChatHeader from './chat-area/ChatHeader';
import MessageList from './chat-area/MessageList';
import MessageInput from './chat-area/MessageInput';

const ChatArea = ({ activeChat }) => {
  // Mock data for messages
  const dummyMessages = activeChat ? [
    { id: 1, content: 'Hola, ¿cómo estás?', time: '10:45 AM', senderId: activeChat.id !== 1 ? activeChat.id : 2 },
    { id: 2, content: '¡Todo bien! Trabajando en el proyecto. ¿Y tú?', time: '10:46 AM', senderId: 'me', status: 'read' }
  ] : [];

  const handleSendMessage = (content) => {
    console.log("Sending:", content, "to", activeChat?.name);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#e5e5f7] relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
      
      {activeChat ? (
        <>
          <ChatHeader 
            activeChat={activeChat}
            onSearch={() => console.log('Search in chat')}
            onOptions={() => console.log('Chat options')}
          />
          <MessageList 
            messages={dummyMessages}
            currentUserId="me"
          />
          <MessageInput 
            onSend={handleSendMessage}
            disabled={!activeChat}
          />
        </>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center relative z-10 p-6 text-center">
          <div className="bg-white border-4 border-black p-6 rounded-sm shadow-[8px_8px_0px_0px_#000] max-w-md">
            <h2 className="text-2xl font-black mb-2 text-black">ChatHub</h2>
            <p className="font-bold text-gray-600">Selecciona un chat del panel izquierdo para comenzar a mensajear.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
