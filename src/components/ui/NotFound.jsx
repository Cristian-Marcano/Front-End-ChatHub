import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';

const NotFound = () => {
  const [countdown, setCountdown] = useState(15);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown === 0) {
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <Card title="Error 404">
      <div className="flex flex-col items-center text-center gap-6">
        <h1 className="text-6xl font-black text-black">404</h1>
        <p className="font-bold text-gray-700">
          La página que buscas no existe o ha sido movida.
        </p>
        
        <div className="bg-yellow-300 border-4 border-black p-4 rounded-sm shadow-[4px_4px_0px_0px_#000] w-full">
          <p className="font-black text-xl">
            Redirigiendo en <span className="text-red-500">{countdown}</span> segundos...
          </p>
        </div>
        
        <button 
          onClick={() => setCountdown(0)}
          className="mt-4 text-sm font-bold text-black underline decoration-2 underline-offset-2 hover:text-blue-600 transition-colors cursor-pointer"
        >
          Ir ahora mismo
        </button>
      </div>
    </Card>
  );
};

export default NotFound;
