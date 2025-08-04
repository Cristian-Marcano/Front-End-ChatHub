import { useState, useEffect } from 'react';
import Toast from './Toast';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleAddToast = (event) => {
      const { message, type, duration } = event.detail;
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      
      setToasts((prev) => {
        // Limit to 5 toasts
        const newToasts = [...prev, { id, message, type, duration }];
        if (newToasts.length > 5) {
          return newToasts.slice(newToasts.length - 5);
        }
        return newToasts;
      });
    };

    window.addEventListener('add-toast', handleAddToast);
    return () => window.removeEventListener('add-toast', handleAddToast);
  }, []);

  const handleCloseToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast 
            id={t.id} 
            message={t.message} 
            type={t.type} 
            duration={t.duration}
            onClose={handleCloseToast} 
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
