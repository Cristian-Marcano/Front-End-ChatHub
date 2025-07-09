import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../../context/SocketContext';

export const useFriendshipSocket = () => {
  const { socket, isConnected } = useSocket();
  const [friendships, setFriendships] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on('friendship:results', (data) => {
      if (data.results && Array.isArray(data.results)) {
        console.log("Friendship results:", data.results);
        setFriendships(data.results);
      }
    });

    socket.on('friendship:newRequest', (data) => {
      console.log("New friendship request:", data);
    });

    return () => {
      socket.off('friendship:results');
      socket.off('friendship:newRequest');
    };
  }, [socket, isConnected]);

  const loadFriendships = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('friendship:load');
    }
  }, [socket, isConnected]);

  const loadRequests = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('friendship:request'); 
    }
  }, [socket, isConnected]);

  return { friendships, requests, loadFriendships, loadRequests };
};
