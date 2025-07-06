import { MessageSquarePlus, MoreVertical, LogOut } from 'lucide-react';
import ChatAvatar from '../ui/ChatAvatar';
import ChatIconButton from '../ui/ChatIconButton';

const SidebarHeader = ({ onProfileClick, onNewChat, onOptions, onLogout, userProfile }) => {
  return (
    <div className="h-16 border-b-4 border-black bg-white flex items-center justify-between px-4 shrink-0">
      <ChatAvatar 
        config={userProfile?.photo} 
        name={userProfile?.full_name || userProfile?.username || "User"} 
        onClick={onProfileClick}
        title="Editar perfil"
      />
      <div className="flex gap-4">
        <ChatIconButton icon={MessageSquarePlus} onClick={onNewChat} title="Nuevo chat" />
        <ChatIconButton icon={MoreVertical} onClick={onOptions} title="Más opciones" />
        <ChatIconButton icon={LogOut} onClick={onLogout} title="Cerrar Sesión" color="text-red-500" hoverColor="text-red-600" />
      </div>
    </div>
  );
};

export default SidebarHeader;
