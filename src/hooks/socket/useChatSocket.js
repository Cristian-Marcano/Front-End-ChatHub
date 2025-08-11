import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';

export const useChatSocket = (activeChatId) => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [isContactTyping, setIsContactTyping] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const historyPageRef = useRef(1);

  useEffect(() => {
    if (!socket || !isConnected) return;

    
    socket.on('chat:results', (data) => {
      if (data.results && Array.isArray(data.results)) {
        setChats(data.results);
      }
    });

    socket.on('chat:historyResults', (data) => {
      if (data.results && Array.isArray(data.results)) {
        if (data.results.length < 40) {
          setHasMoreHistory(false);
        } else {
          setHasMoreHistory(true);
        }

        setMessages(prev => {
          if (historyPageRef.current === 1) {
            return data.results;
          }
          return [...data.results, ...prev];
        });
        setIsLoadingMore(false);
      }
    });


    socket.on('chat:newMessage', (data) => {
      setMessages(prev => [...prev, data.results]);
      // If we are currently in this chat, mark the incoming message as read instantly
      if (data.results.chat_id === activeChatId) {
        socket.emit('chat:markAsRead', { chatId: activeChatId });
      }
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

    
    socket.on('chat:messagesRead', (data) => {
      // If someone read the messages in our current chat
      if (data.chatId === activeChatId) {
        setMessages(prev => prev.map(m => 
          // Only update messages sent by us that weren't read yet
          (m.user_sending_id !== data.readBy && m.status !== 'read') ? { ...m, status: 'read' } : m
        ));
      }
    });

    socket.on('chat:typing', (data) => {
      // data: { userId, chatId, isTyping }
      if (data.chatId === activeChatId) {
        setIsContactTyping(data.isTyping !== false); // fallback to true if undefined
      }
    });

    return () => {
      socket.off('chat:results');
      socket.off('chat:historyResults');
      socket.off('chat:newMessage');
      socket.off('chat:messageEdited');
      socket.off('chat:messageDeleted');
      socket.off('chat:typing');
      socket.off('chat:messagesRead');

      socket.off('chat:searchResults');
      socket.off('chat:contextResults');

    };
  }, [socket, isConnected, activeChatId]);

  // When active chat changes, load history
  useEffect(() => {
    if (socket && isConnected && activeChatId) {
      setMessages([]); // clear while loading
      setSearchResults([]);
      setHasMoreHistory(true);
      historyPageRef.current = 1;
      setIsLoadingMore(false);
      historyPageRef.current = 1;
      setHasMoreHistory(true);
      socket.emit('chat:history', { chatId: activeChatId, page: 1, limit: 40 });
      socket.emit('chat:markAsRead', { chatId: activeChatId });
    }
  }, [activeChatId, socket, isConnected]);

  
  const loadMoreHistory = useCallback(() => {
    if (socket && activeChatId && hasMoreHistory && !isLoadingMore) {
      setIsLoadingMore(true);
      historyPageRef.current += 1;
      socket.emit('chat:history', { chatId: activeChatId, page: historyPageRef.current, limit: 40 });
    }
  }, [socket, activeChatId, hasMoreHistory, isLoadingMore]);

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

  const markAsRead = useCallback(() => {
    if (socket && activeChatId) {
      socket.emit('chat:markAsRead', { chatId: activeChatId });
    }
  }, [socket, activeChatId]);

  const loadContext = useCallback((messageId) => {
    if (socket && activeChatId) {
      socket.emit('chat:loadContext', { chatId: activeChatId, targetMessageId: messageId });
    }
  }, [socket, activeChatId]);

  const reloadHistory = useCallback(() => {
    if (socket && activeChatId) {
      socket.emit('chat:history', { chatId: activeChatId, page: 1, limit: 40 });
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

  return { chats, messages, searchResults, isSearching, hasMoreHistory, isLoadingMore, loadMoreHistory, loadChats, sendMessage, setTyping, readMessage, markAsRead, isContactTyping, searchMessages, loadContext, reloadHistory };
};
