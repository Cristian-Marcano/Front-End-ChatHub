import { AvatarPreview } from '../../../profile';

const ChatAvatar = ({ config, name, className = '', onClick, title }) => {
  return (
    <div 
      onClick={onClick}
      className={`rounded-sm border-2 border-black w-10 h-10 overflow-hidden shrink-0 ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-none transition-all' : ''} ${className}`}
      title={title}
    >
      <AvatarPreview config={config} name={name} className="w-full h-full border-none shadow-none" />
    </div>
  );
};

export default ChatAvatar;
