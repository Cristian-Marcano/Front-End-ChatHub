import { useEffect, useState } from 'react';

const Toast = ({ id, message, type = 'error', onClose, duration = 15000 }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setIsClosing(false);
    const timer = setTimeout(() => {
      setIsClosing(true);
    }, duration - 400); // 400ms duration of the fade-out animation

    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        onClose(id);
      }, 400); // Wait for the animation to finish before unmounting
      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose, id]);

  const handleClose = () => {
    setIsClosing(true);
  };

  const bgColors = {
    error: 'bg-red-400',
    success: 'bg-green-400',
    info: 'bg-blue-400',
  };

  return (
    <div className={`transition-all duration-300 ${isClosing ? 'opacity-0 scale-90 -translate-y-4' : 'opacity-100 scale-100 translate-y-0 animate-slide-in'}`}>
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
