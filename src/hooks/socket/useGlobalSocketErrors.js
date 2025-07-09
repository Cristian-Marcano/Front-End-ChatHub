import { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext';

export const useGlobalSocketErrors = () => {
  const { socket } = useSocket();
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!socket) return;

    const handleValidateError = (data) => {
      console.error("Socket Validation Error:", data.error);
      setErrorMsg(data.error?.message || 'Error de validación en la solicitud');
    };

    const handleServerError = (data) => {
      console.error("Socket Server Error:", data);
      setErrorMsg(data.message || 'Error del servidor');
    };

    socket.on('error:validate', handleValidateError);
    socket.on('error:server', handleServerError);

    return () => {
      socket.off('error:validate', handleValidateError);
      socket.off('error:server', handleServerError);
    };
  }, [socket]);

  return { errorMsg, setErrorMsg };
};
