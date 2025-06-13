import { Search, MoreVertical, MessageSquarePlus, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../auth/services/authService';
import { AvatarPreview } from '../../profile';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await authService.logout(refreshToken);
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  };

  const dummyChats = [
    { id: 1, name: 'Alice', lastMessage: 'Hola, ¿cómo estás?', time: '10:45 AM', unread: 2, color: 'bg-pink-400' },
    { id: 2, name: 'Bob', lastMessage: 'No te olvides de la reunión.', time: 'Ayer', unread: 0, color: 'bg-blue-400' },
    { id: 3, name: 'Charlie', lastMessage: 'Jajaja, sí 😅', time: 'Ayer', unread: 0, color: 'bg-green-400' },
  ];

  return (
    <div className="w-1/3 min-w-[320px] max-w-[450px] border-r-4 border-black flex flex-col bg-bg-light z-10">
      {/* Header */}
      <div className="h-16 border-b-4 border-black bg-white flex items-center justify-between px-4 shrink-0">
        <div 
          onClick={() => navigate('/profile')}
          className="cursor-pointer hover:-translate-y-1 hover:shadow-none transition-all rounded-sm border-2 border-black w-10 h-10 overflow-hidden shrink-0" 
          title="Editar perfil"
        >
          <AvatarPreview config={null} name="User" className="w-full h-full border-none shadow-none" />
        </div>
        <div className="flex gap-4">
          <button className="text-black hover:scale-110 transition-transform cursor-pointer" title="Nuevo chat"><MessageSquarePlus size={24} /></button>
          <button className="text-black hover:scale-110 transition-transform cursor-pointer" title="Más opciones"><MoreVertical size={24} /></button>
          <button onClick={handleLogout} className="text-red-500 hover:scale-110 transition-transform cursor-pointer" title="Cerrar Sesión"><LogOut size={24} /></button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b-4 border-black bg-white shrink-0">
        <div className="relative w-full">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Buscar o empezar un chat nuevo" 
            className="w-full h-10 pl-10 pr-4 bg-gray-200 border-2 border-black rounded-sm focus:outline-none focus:bg-white transition-colors text-sm font-bold"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {dummyChats.map(chat => (
          <div key={chat.id} className="flex items-center p-3 border-b-2 border-black hover:bg-white cursor-pointer transition-colors group">
            <div className={`w-12 h-12 ${chat.color} border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_#000] shrink-0 mr-4 group-hover:-translate-y-1 transition-transform`}></div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-black truncate">{chat.name}</h3>
                <span className="text-xs font-black text-gray-600 ml-2">{chat.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-600 truncate">{chat.lastMessage}</p>
                {chat.unread > 0 && (
                  <span className="bg-green-400 text-black text-xs font-black px-2 py-1 border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_#000] ml-2">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
