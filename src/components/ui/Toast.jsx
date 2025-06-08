import { useEffect, useState } from 'react';

const Toast = ({ message, type = 'error', onClose, duration = 5000 }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (message) {
      setIsClosing(false);
      const timer = setTimeout(() => {
        setIsClosing(true);
      }, duration - 400); // 400ms duration of the fade-out animation

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        onClose();
      }, 400); // Wait for the animation to finish before unmounting
      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose]);

  const handleClose = () => {
    setIsClosing(true);
  };

  if (!message) return null;

  const bgColors = {
    error: 'bg-red-400',
    success: 'bg-green-400',
    info: 'bg-blue-400',
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${isClosing ? 'animate-fade-out' : 'animate-slide-in'}`}>
      <div className={`px-6 py-4 flex items-center justify-between gap-6 border-4 border-black shadow-[8px_8px_0px_0px_#000] ${bgColors[type] || bgColors.info}`}>
        <p className="font-bold text-black text-lg uppercase tracking-wide">{message}</p>
        <button 
          onClick={handleClose}
          className="text-black font-black text-xl hover:scale-125 transition-transform cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
