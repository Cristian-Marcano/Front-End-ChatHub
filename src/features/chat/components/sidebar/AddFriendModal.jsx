import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { UserPlus, Search, X } from 'lucide-react';
import { InputField } from '../../../../components/ui';
import { useUserSocket } from '../../../../hooks/socket/useUserSocket';
import { useFriendshipSocket } from '../../../../hooks/socket/useFriendshipSocket';

const AddFriendModal = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { searchResults, searchUsers, isSearching } = useUserSocket();
  const { sendRequest } = useFriendshipSocket();

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      searchUsers(searchQuery);
    }
  }, [searchQuery, searchUsers]);

  const handleSendRequest = (userId) => {
    sendRequest(userId);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white p-6 md:p-8 rounded-sm border-4 border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-xl h-[80vh] flex flex-col">
        
        <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-4">
          <h3 className="text-2xl font-black uppercase flex items-center gap-2">
            <UserPlus size={24} strokeWidth={3} />
            Añadir Usuario
          </h3>
          <button 
            onClick={onClose}
            className="hover:bg-gray-200 p-1 rounded-sm border-2 border-transparent hover:border-black transition-all"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <div className="mb-4">
          <InputField 
            type="text" 
            placeholder="Buscar por username o correo..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto border-2 border-black rounded-sm">
          {!searchQuery.trim() ? (
            <div className="p-6 text-center text-gray-500 font-bold">
              Escribe un username o correo para buscar usuarios.
            </div>
          ) : isSearching ? (
            <div className="p-6 text-center text-gray-500 font-bold">
              Buscando...
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map(user => (
               <div key={user.id} className="flex items-center justify-between p-3 border-b-2 border-black last:border-b-0 hover:bg-gray-100 transition-colors">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-blue-300 border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_#000]"></div>
                   <div>
                     <p className="font-bold text-black">{user.username}</p>
                     <p className="text-xs text-gray-600">{user.email}</p>
                   </div>
                 </div>
                 <button 
                   onClick={() => handleSendRequest(user.id)}
                   className="bg-primary text-white text-xs font-bold px-3 py-1 border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
                 >
                   Añadir
                 </button>
               </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500 font-bold">
              No se encontraron usuarios nuevos.
            </div>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
};

export default AddFriendModal;
