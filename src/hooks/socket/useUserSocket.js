import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../../context/SocketContext';

export const useUserSocket = () => {
  const { socket, isConnected } = useSocket();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on('user:results', (data) => {
      console.log('User search results:', data.results);
      setSearchResults(data.results || []);
      setIsSearching(false);
    });

    return () => {
      socket.off('user:results');
    };
  }, [socket, isConnected]);

  const searchUsers = useCallback((query) => {
    if (socket && isConnected && query.trim()) {
      setIsSearching(true);
      // The backend validates either username or email. We will pass both with the query string.
      socket.emit('user:search', { 
        username: query,
        email: query, 
        page: 1, 
        pageSize: 15 
      });
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [socket, isConnected]);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  return { searchResults, isSearching, searchUsers, clearSearch };
};
