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
        if (data.results.length === 0) {
          // It's hard to know which array is empty since both use the same event.
          // But usually we don't clear unless we know. Let's just keep it as is.
          return;
        }
        
        const firstItem = data.results[0];
        const isPending = firstItem.primary_state === 'pending' || firstItem.secondary_state === 'pending';
        
        if (isPending) {
          // Only store requests where we are the RECIPIENT.
          // In MySQL: f.secondary_user_id = ua.id joins the secondary user.
          // Actually, we can just store all of them, but let's see.
          setRequests(data.results);
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
      // Remove from requests locally
      const friendshipId = data.results?.id;
      if (friendshipId) {
        setRequests(prev => prev.filter(req => req.id !== friendshipId));
        // Add to friendships
        setFriendships(prev => [...prev, data.results]);
      }
    });
    
    socket.on('friendship:rejected', (data) => {
      // Remove from requests locally
      const friendshipId = data.results?.id;
      if (friendshipId) {
        setRequests(prev => prev.filter(req => req.id !== friendshipId));
      }
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
