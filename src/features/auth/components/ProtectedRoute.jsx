import { Navigate, Outlet } from 'react-router-dom';
import { SocketProvider } from '../../../context/SocketContext';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  );
};

export default ProtectedRoute;
