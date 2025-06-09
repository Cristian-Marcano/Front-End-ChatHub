import { MoreVertical, Search, Paperclip, Send } from 'lucide-react';

const ChatArea = () => {
  return (
    <div className="flex-1 flex flex-col bg-[#e5e5f7] relative">
      {/* Pattern de fondo brutalista */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Header */}
      <div className="h-16 border-b-4 border-black bg-white flex items-center justify-between px-4 shrink-0 relative z-10">
        <div className="flex items-center gap-4 cursor-pointer group">
          <div className="w-10 h-10 bg-pink-400 border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_#000] group-hover:-translate-y-1 transition-transform"></div>
          <div>
            <h2 className="font-black text-black leading-tight">Alice</h2>
            <p className="text-xs font-bold text-gray-600">En línea</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="text-black hover:scale-110 transition-transform cursor-pointer"><Search size={24} /></button>
          <button className="text-black hover:scale-110 transition-transform cursor-pointer"><MoreVertical size={24} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 relative z-10">
        <div className="self-start max-w-[75%]">
          <div className="bg-white border-4 border-black p-3 rounded-sm shadow-[4px_4px_0px_0px_#000]">
            <p className="font-bold text-black text-base">Hola, ¿cómo estás?</p>
            <span className="text-[10px] text-gray-500 font-black block text-right mt-1">10:45 AM</span>
          </div>
        </div>
        
        <div className="self-end max-w-[75%]">
          <div className="bg-green-400 border-4 border-black p-3 rounded-sm shadow-[4px_4px_0px_0px_#000]">
            <p className="font-bold text-black text-base">¡Todo bien! Trabajando en el proyecto. ¿Y tú?</p>
            <span className="text-[10px] text-gray-800 font-black block text-right mt-1">10:46 AM ✓✓</span>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="min-h-[72px] border-t-4 border-black bg-white flex items-center px-4 py-3 gap-4 shrink-0 relative z-10">
        <button className="text-black hover:scale-110 transition-transform cursor-pointer shrink-0"><Paperclip size={24} /></button>
        <input 
          type="text" 
          placeholder="Escribe un mensaje..." 
          className="flex-1 h-12 px-4 bg-gray-100 border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:bg-white focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all font-bold text-black"
        />
        <button className="bg-primary text-white border-2 border-black h-12 w-12 flex items-center justify-center rounded-sm shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all cursor-pointer shrink-0">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
