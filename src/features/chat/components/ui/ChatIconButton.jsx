const ChatIconButton = ({ icon: Icon, onClick, title, color = "text-black", hoverColor = "text-black", className = "" }) => {
  return (
    <button 
      onClick={onClick}
      className={`${color} hover:${hoverColor} hover:scale-110 transition-transform cursor-pointer shrink-0 flex items-center justify-center ${className}`}
      title={title}
      type="button"
    >
      <Icon size={24} />
    </button>
  );
};

export default ChatIconButton;
