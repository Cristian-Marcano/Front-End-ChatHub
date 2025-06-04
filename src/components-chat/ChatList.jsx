const ChatList = ({ onSelectChat }) => {
  const chats = [
    {
      id: 1,
      name: 'Cristian Marcano',
      lastMessage: '¡Hola! ¿Cómo estás?',
      time: '14:32',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 2,
      name: 'Jhonny Suarez',
      lastMessage: '¿Cuando vamos a jugar?',
      time: '13:21',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: 3,
      name: 'Fabian Araujo',
      lastMessage: 'Pido perdon',
      time: '12:10',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
  ];

  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="chat-item"
          onClick={() => onSelectChat(chat)}
        >
          <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
          <div className="chat-info">
            <div className="chat-header">
              <span className="chat-name">{chat.name}</span>
              <span className="chat-time">{chat.time}</span>
            </div>
            <div className="chat-last-message">{chat.lastMessage}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;