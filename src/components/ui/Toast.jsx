import { useEffect } from 'react';

const Toast = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const bgColors = {
    error: 'bg-red-400',
    success: 'bg-green-400',
    info: 'bg-blue-400',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
      <div className={`px-6 py-4 flex items-center justify-between gap-6 border-4 border-black shadow-[8px_8px_0px_0px_#000] ${bgColors[type] || bgColors.info}`}>
        <p className="font-bold text-black text-lg uppercase tracking-wide">{message}</p>
        <button 
          onClick={onClose}
          className="text-black font-black text-xl hover:scale-125 transition-transform cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
