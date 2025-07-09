import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../../context/SocketContext';

export const useChatSocket = (activeChatId) => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on('chat:results', (data) => {
      // Chat history response
      if (data.results && Array.isArray(data.results)) {
        console.log("Chat history loaded:", data.results);
        setMessages(data.results);
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

  return { messages, sendMessage, setTyping, readMessage };
};
