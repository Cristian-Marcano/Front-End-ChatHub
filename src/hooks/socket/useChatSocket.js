import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../../context/SocketContext';

export const useChatSocket = (activeChatId) => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on('chat:results', (data) => {
      if (data.results && Array.isArray(data.results)) {
        if (data.results.length === 0) return;
        
        // Distinguish between chat history and chat list
        // Chat list has 'nickname' or 'chat_type', history has 'msg_text' or 'chat_id'
        const first = data.results[0];
        if (first.nickname !== undefined || first.chat_type !== undefined) {
          console.log("Chat list loaded:", data.results);
          setChats(data.results);
        } else {
          console.log("Chat history loaded:", data.results);
          setMessages(data.results);
        }
      }
    });

    socket.on('chat:newMessage', (data) => {
      console.log("New message:", data);
      setMessages(prev => [...prev, data.results]);
    });

    socket.on('chat:messageEdited', (data) => {
      setMessages(prev => prev.map(m => m.id === data.results.id ? data.results : m));
    });

    socket.on('chat:messageDeleted', (data) => {
      setMessages(prev => prev.filter(m => m.id !== data.id));
    });

    return () => {
      socket.off('chat:results');
      socket.off('chat:newMessage');
      socket.off('chat:messageEdited');
      socket.off('chat:messageDeleted');
    };
  }, [socket, isConnected]);

  // When active chat changes, load history
  useEffect(() => {
    if (socket && isConnected && activeChatId) {
      setMessages([]); // clear while loading
      socket.emit('chat:history', { chatId: activeChatId });
    }
  }, [activeChatId, socket, isConnected]);

  const loadChats = useCallback(() => {
    if (socket && isConnected) {
      // Backend validates pagination for this
      socket.emit('chat:getAll', { page: 1, pageSize: 20 });
    }
  }, [socket, isConnected]);

  const sendMessage = useCallback((content) => {
    if (socket && activeChatId) {
      socket.emit('chat:sendMessage', { chatId: activeChatId, content });
    }
  }, [socket, activeChatId]);

  const setTyping = useCallback((isTyping) => {
    if (socket && activeChatId) {
      socket.emit('chat:typing', { chatId: activeChatId, isTyping });
    }
  }, [socket, activeChatId]);

  const readMessage = useCallback((messageId) => {
    if (socket && activeChatId) {
      socket.emit('chat:readMessage', { chatId: activeChatId, messageId });
    }
  }, [socket, activeChatId]);

  return { chats, messages, loadChats, sendMessage, setTyping, readMessage };
};
