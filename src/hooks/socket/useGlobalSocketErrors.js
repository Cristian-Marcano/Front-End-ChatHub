import { useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { toast } from '../../utils/toast';

export const useGlobalSocketErrors = () => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleValidateError = (data) => {
      console.error("Socket Validation Error:", data.error);
      toast.error(data.error?.message || 'Error de validación en la solicitud');
    };

    const handleServerError = (data) => {
      console.error("Socket Server Error:", data);
      toast.error(data.message || 'Error del servidor');
    };

    socket.on('error:validate', handleValidateError);
    socket.on('error:server', handleServerError);

    return () => {
      socket.off('error:validate', handleValidateError);
      socket.off('error:server', handleServerError);
    };
  }, [socket]);

  return {};
};
