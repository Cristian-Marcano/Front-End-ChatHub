import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useGlobalSocketErrors } from './useGlobalSocketErrors'; // For showing success toasts if needed

export const useFriendshipSocket = () => {
  const { socket, isConnected } = useSocket();
  const [friendships, setFriendships] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Both `load` and `request` emit back to `friendship:results`.
    // We can differentiate by assuming `load` returns chats (which have chat_id or friend_name) 
    // and `request` returns raw user info (or we just reload both).
    // Let's listen to `results` and see what it contains.
    socket.on('friendship:results', (data) => {
      if (data.results && Array.isArray(data.results)) {
        // If it looks like a request (has username, no chat_id)
        const isRequestList = data.results.length > 0 && !data.results[0].chatId;
        
        if (isRequestList || (data.results.length === 0 && requests.length > 0)) {
           // We might need a better way to distinguish empty lists, but for now:
           // If we manually call `loadRequests()`, it populates `requests`.
           // Let's actually refine this by listening to specific events if possible, or just checking structure.
           if (data.results.some(r => r.state === 'pending' || r.username)) {
             setRequests(data.results);
           } else {
             setFriendships(data.results);
           }
        } else {
           setFriendships(data.results);
        }
      }
    });

    socket.on('friendship:newRequest', (data) => {
      // Someone sent us a request
      setRequests(prev => [...prev, data.results]);
    });
    
    socket.on('friendship:received', (data) => {
      // Acknowledgment that our request was sent successfully
      console.log('Request sent successfully:', data.message);
    });

    socket.on('friendship:accepted', (data) => {
      // Reload both lists when a friendship is accepted
      socket.emit('friendship:load');
      socket.emit('friendship:request');
    });
    
    socket.on('friendship:rejected', (data) => {
      // Reload requests when rejected
      socket.emit('friendship:request');
    });

    return () => {
      socket.off('friendship:results');
      socket.off('friendship:newRequest');
      socket.off('friendship:received');
      socket.off('friendship:accepted');
      socket.off('friendship:rejected');
    };
  }, [socket, isConnected, requests.length]);

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
  
  const sendRequest = useCallback((userId) => {
    if (socket && isConnected) {
      socket.emit('friendship:sent', { secondary_user_id: userId });
    }
  }, [socket, isConnected]);
  
  const acceptRequest = useCallback((userId) => {
    if (socket && isConnected) {
      // According to backend: data is the ID of the primary user (the one who sent it)
      // or the friendship ID? The schema says `validateId(id)`. 
      // It expects just a single integer `id` which is the friendship primary key or user ID?
      // Wait, in friendshipController: `const resultSchema = validateId(id)` and uses `resultSchema.data`.
      // Let's send the ID.
      socket.emit('friendship:accept', { id: userId }); 
    }
  }, [socket, isConnected]);

  const rejectRequest = useCallback((userId) => {
    if (socket && isConnected) {
      socket.emit('friendship:rejection', { id: userId });
    }
  }, [socket, isConnected]);

  return { friendships, requests, loadFriendships, loadRequests, sendRequest, acceptRequest, rejectRequest };
};
