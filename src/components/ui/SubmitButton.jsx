const SubmitButton = ({ children, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full h-12 rounded-sm border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000] text-black font-bold uppercase tracking-wider cursor-pointer active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
  >
    {children}
  </button>
);

export default SubmitButton;
