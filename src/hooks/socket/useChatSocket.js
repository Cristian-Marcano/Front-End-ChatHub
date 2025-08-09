import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../../context/SocketContext';

export const useChatSocket = (activeChatId) => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [isContactTyping, setIsContactTyping] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on('chat:results', (data) => {
      if (data.results && Array.isArray(data.results)) {
        if (data.results.length === 0) {
          // Si el historial o lista está vacío
          // Diferenciamos si es de chats o mensajes por el activeChatId
          // Nota: Si activeChatId existe, asumimos que history está cargando mensajes
          return;
        }
        
        const first = data.results[0];
        if (first.nickname !== undefined || first.chat_type !== undefined) {
          setChats(data.results);
        } else {
          setMessages(data.results);
        }
      }
    });

    socket.on('chat:newMessage', (data) => {
      setMessages(prev => [...prev, data.results]);
    });

    socket.on('chat:messageEdited', (data) => {
      setMessages(prev => prev.map(m => m.id === data.results.id ? data.results : m));
    });

    socket.on('chat:messageDeleted', (data) => {
      setMessages(prev => prev.filter(m => m.id !== data.id));
    });

    
    socket.on('chat:searchResults', (data) => {
      setIsSearching(false);
      setSearchResults(data.results || []);
    });

    socket.on('chat:contextResults', (data) => {
      setMessages(data.results || []);
    });

    socket.on('chat:typing', (data) => {
      // data: { userId, chatId, isTyping }
      if (data.chatId === activeChatId) {
        setIsContactTyping(data.isTyping !== false); // fallback to true if undefined
      }
    });

    return () => {
      socket.off('chat:results');
      socket.off('chat:newMessage');
      socket.off('chat:messageEdited');
      socket.off('chat:messageDeleted');
      socket.off('chat:typing');

      socket.off('chat:searchResults');
      socket.off('chat:contextResults');

    };
  }, [socket, isConnected, activeChatId]);

  // When active chat changes, load history
  useEffect(() => {
    if (socket && isConnected && activeChatId) {
      setMessages([]); // clear while loading
      setSearchResults([]);
      socket.emit('chat:history', { chatId: activeChatId });
    }
  }, [activeChatId, socket, isConnected]);

  const loadChats = useCallback(() => {
    if (socket && isConnected) {
      // Backend validates pagination for this
      socket.emit('chat:getAll', { page: 1, pageSize: 20 });
    }
  }, [socket, isConnected]);

  
  const searchMessages = useCallback((query) => {
    if (socket && activeChatId && query.trim()) {
      setIsSearching(true);
      socket.emit('chat:searchMessages', { chatId: activeChatId, query, page: 1, limit: 50 });
    } else {
      setSearchResults([]);
    }
  }, [socket, activeChatId]);

  const loadContext = useCallback((messageId) => {
    if (socket && activeChatId) {
      socket.emit('chat:loadContext', { chatId: activeChatId, targetMessageId: messageId });
    }
  }, [socket, activeChatId]);

  const reloadHistory = useCallback(() => {
    if (socket && activeChatId) {
      socket.emit('chat:history', { chatId: activeChatId });
    }
  }, [socket, activeChatId]);

  const sendMessage = useCallback((content) => {
    if (socket && activeChatId) {
      socket.emit('chat:sendMessage', { chatId: activeChatId, msgText: content });
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

  return { chats, messages, searchResults, isSearching, loadChats, sendMessage, setTyping, readMessage, isContactTyping, searchMessages, loadContext, reloadHistory };
};
