import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';

export const useChatSocket = (activeChatId) => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const chatPageRef = useRef(1);
  const [chatPage, setChatPage] = useState(1);
  const [hasMoreChats, setHasMoreChats] = useState(true);
  const [isLoadingMoreChats, setIsLoadingMoreChats] = useState(false);
  const [isContactTyping, setIsContactTyping] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [contactSearchResults, setContactSearchResults] = useState([]);
  const [isSearchingContacts, setIsSearchingContacts] = useState(false);
  const [hasMoreContacts, setHasMoreContacts] = useState(true);
  const contactSearchPageRef = useRef(1);
  const contactSearchQueryRef = useRef('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const historyPageRef = useRef(1);

  useEffect(() => {
    if (!socket || !isConnected) return;

    
    socket.on('chat:searchedChats', (data) => {
      const results = data.results || [];
      if (contactSearchPageRef.current === 1) {
        setContactSearchResults(results);
      } else {
        setContactSearchResults(prev => {
          // Prevent duplicates
          const existingIds = new Set(prev.map(c => c.friend_id));
          const newUnique = results.filter(c => !existingIds.has(c.friend_id));
          return [...prev, ...newUnique];
        });
      }
      setHasMoreContacts(results.length >= 20);
      setIsSearchingContacts(false);
    });

    socket.on('chat:results', (data) => {
      if (data.results && Array.isArray(data.results)) {
        if (chatPageRef.current === 1) {
          setChats(data.results);
        } else {
          setChats(prev => {
              const existingIds = new Set(prev.map(c => c.id));
              const newChats = data.results.filter(c => !existingIds.has(c.id));
              return [...prev, ...newChats];
          });
        }
        setHasMoreChats(data.results.length === 20);
        setIsLoadingMoreChats(false);
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

    
    
    socket.on('group:left', (data) => {
      // Si el usuario sale del grupo, recargamos los chats y des-seleccionamos el chat activo si era este
      setChatPage(1);
      setHasMoreChats(true);
      socket.emit('chat:getAll', { page: 1, pageSize: 20 });
      // We can't clear activeChatId directly here unless we expose it, but ChatLayout handles the selection.
      // Usually, if the active chat disappears from the list, it will just show "Chat not found" or we can navigate away.
      // Actually if they click it, the chat might stay open but fail to send messages. A simple window.location.reload() or passing an event is better, but reloading chat list is enough.
      window.location.reload(); // Quick brutalist way to clear context.
    });

    socket.on('group:addedToGroup', () => {
      // Reload chats if someone adds us to a group
      socket.emit('chat:getAll', { page: 1, pageSize: 20 });
    });

    socket.on('chat:typing', (data) => {
      // data: { userId, chatId, isTyping }
      if (data.chatId === activeChatId) {
        setIsContactTyping(data.isTyping !== false); // fallback to true if undefined
      }
    });

    return () => {
      socket.off('chat:results');
      socket.off('chat:searchedChats');
      socket.off('chat:historyResults');
      socket.off('chat:newMessage');
      socket.off('chat:messageEdited');
      socket.off('chat:messageDeleted');
      socket.off('chat:typing');
      socket.off('group:addedToGroup');
      socket.off('group:left');
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

  
  const loadMoreChats = useCallback(() => {
    if (socket && isConnected && hasMoreChats && !isLoadingMoreChats) {
      setIsLoadingMoreChats(true);
      const nextPage = chatPage + 1;
      setChatPage(nextPage);
      socket.emit('chat:getAll', { page: nextPage, pageSize: 20 });
    }
  }, [socket, isConnected, chatPage, hasMoreChats, isLoadingMoreChats]);

  const loadChats = useCallback(() => {
    if (socket && isConnected) {
      // Backend validates pagination for this
      socket.emit('chat:getAll', { page: 1, pageSize: 20 });
    }
  }, [socket, isConnected]);

  
  const searchContacts = useCallback((query, loadMore = false) => {
    if (socket && isConnected) {
      if (!query.trim()) {
        setContactSearchResults([]);
        setIsSearchingContacts(false);
        setHasMoreContacts(false);
        return;
      }
      
      let page = 1;
      if (loadMore) {
        if (!hasMoreContacts || isSearchingContacts) return;
        page = contactSearchPageRef.current + 1;
      } else {
        // Reset state for new search
        contactSearchQueryRef.current = query;
      }
      
      contactSearchPageRef.current = page;
      setIsSearchingContacts(true);
      socket.emit('chat:searchChats', { name: query, page, pageSize: 20 });
    }
  }, [socket, isConnected, hasMoreContacts, isSearchingContacts]);

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

  return { chats, loadMoreChats, contactSearchResults, isSearchingContacts, searchContacts, hasMoreContacts, hasMoreChats, isLoadingMoreChats, messages, searchResults, isSearching, hasMoreHistory, isLoadingMore, loadMoreHistory, loadChats, sendMessage, setTyping, readMessage, markAsRead, isContactTyping, searchMessages, loadContext, reloadHistory };
};
