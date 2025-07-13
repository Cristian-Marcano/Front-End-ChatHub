import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const SidebarSearch = ({ value, onChange, placeholder = "Buscar chats o usuarios..." }) => {
  const [localValue, setLocalValue] = useState(value);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [localValue, onChange]);

  return (
    <div className="p-3 border-b-4 border-black bg-white shrink-0">
      <div className="relative w-full">
        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input 
          type="text" 
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 pl-10 pr-4 bg-gray-200 border-2 border-black rounded-sm focus:outline-none focus:bg-white transition-colors text-sm font-bold"
        />
      </div>
    </div>
  );
};

export default SidebarSearch;
