import { MessageSquarePlus, MoreVertical, LogOut, Bell } from 'lucide-react';
import ChatAvatar from '../ui/ChatAvatar';
import ChatIconButton from '../ui/ChatIconButton';

const SidebarHeader = ({ onProfileClick, onNewChat, onOptions, onLogout, userProfile, requestsCount = 0 }) => {
  return (
    <div className="h-16 border-b-4 border-black bg-white flex items-center justify-between px-4 shrink-0">
      <ChatAvatar 
        config={userProfile?.photo} 
        name={userProfile?.full_name || userProfile?.username || "User"} 
        onClick={onProfileClick}
        title="Editar perfil"
      />
      <div className="flex gap-4 items-center">
        <div className="relative">
          <ChatIconButton icon={Bell} onClick={onOptions} title="Solicitudes" />
          {requestsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-black">
              {requestsCount}
            </span>
          )}
        </div>
        <ChatIconButton icon={MessageSquarePlus} onClick={onNewChat} title="Nuevo chat" />
        <ChatIconButton icon={LogOut} onClick={onLogout} title="Cerrar Sesión" color="text-red-500" hoverColor="text-red-600" />
      </div>
    </div>
  );
};

export default SidebarHeader;
