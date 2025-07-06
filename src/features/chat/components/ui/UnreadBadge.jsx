const UnreadBadge = ({ count, className = "" }) => {
  if (!count || count <= 0) return null;
  
  return (
    <span className={`bg-green-400 text-black text-xs font-black px-2 py-1 border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_#000] ${className}`}>
      {count}
    </span>
  );
};

export default UnreadBadge;
