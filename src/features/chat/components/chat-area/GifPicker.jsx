import { useState, useRef, useEffect } from 'react';
import { Grid } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Search, X } from 'lucide-react';
import { ENV } from '../../../../config/env';

// You can provide a fallback key for testing if the env is empty, but we expect the user to provide it.
const gf = new GiphyFetch(ENV.GIPHY_API_KEY || 'sXpGFDGZs0Dv1mmNVI91DiY5aI2V242Y');

const GifPicker = ({ onSelectGif, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const fetchGifs = (offset) => {
    if (debouncedTerm) {
      return gf.search(debouncedTerm, { offset, limit: 10, lang: 'es' });
    }
    return gf.trending({ offset, limit: 10 });
  };

  const onGifClick = (gif, e) => {
    e.preventDefault();
    onSelectGif(gif.images.original.url);
  };

  return (
    <div 
      ref={containerRef}
      className="absolute bottom-20 left-4 w-72 md:w-80 h-96 bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] flex flex-col z-50 animate-[slideUp_0.2s_ease-out]"
    >
      <div className="p-3 border-b-4 border-black flex items-center justify-between bg-primary shrink-0">
        <h3 className="font-black text-white uppercase tracking-widest text-sm">GIPHY</h3>
        <button onClick={onClose} className="text-white hover:scale-110 transition-transform">
          <X size={18} strokeWidth={3} />
        </button>
      </div>

      <div className="p-3 border-b-4 border-black shrink-0 bg-gray-50">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar GIF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border-2 border-black font-bold text-sm outline-none focus:shadow-[3px_3px_0px_0px_#000] transition-shadow"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" strokeWidth={3} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-bg-light p-2 no-scrollbar">
        <Grid
          key={debouncedTerm}
          fetchGifs={fetchGifs}
          width={containerRef.current ? containerRef.current.offsetWidth - 24 : 280}
          columns={2}
          gutter={8}
          onGifClick={onGifClick}
        />
      </div>
    </div>
  );
};

export default GifPicker;
