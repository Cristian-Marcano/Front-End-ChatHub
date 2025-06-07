const SubmitButton = ({ children, onClick, disabled }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`w-full h-12 rounded-sm border-2 border-black shadow-[4px_4px_0px_0px_#000] font-bold uppercase tracking-wider transition-all 
      ${disabled 
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-[2px_2px_0px_0px_#000] translate-x-[2px] translate-y-[2px]' 
        : 'bg-white text-black cursor-pointer active:shadow-none active:translate-x-[4px] active:translate-y-[4px]'
      }`}
  >
    {children}
  </button>
);

export default SubmitButton;
