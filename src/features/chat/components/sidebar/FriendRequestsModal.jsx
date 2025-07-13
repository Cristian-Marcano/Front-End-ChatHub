import { X, Check, XCircle } from 'lucide-react';

const FriendRequestsModal = ({ requests, onClose, onAccept, onReject }) => {
  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col border-r-4 border-black animate-in slide-in-from-left-full duration-200">
      <div className="h-16 border-b-4 border-black bg-primary flex items-center justify-between px-4 shrink-0">
        <h2 className="font-black text-white text-lg">Solicitudes de Amistad</h2>
        <button 
          onClick={onClose}
          className="text-white hover:scale-110 transition-transform cursor-pointer"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-bg-light p-4">
        {requests && requests.length > 0 ? (
          <div className="flex flex-col gap-3">
            {requests.map(req => (
              <div key={req.id} className="bg-white border-2 border-black p-3 flex items-center justify-between rounded-sm shadow-[4px_4px_0px_0px_#000]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-300 border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_#000]"></div>
                  <div>
                    <p className="font-bold text-black">{req.username || 'Usuario'}</p>
                    <p className="text-xs font-semibold text-gray-500">Quiere ser tu amigo</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onAccept(req.id)}
                    className="bg-green-400 text-black border-2 border-black w-8 h-8 flex items-center justify-center rounded-sm shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all cursor-pointer"
                    title="Aceptar"
                  >
                    <Check size={16} strokeWidth={3} />
                  </button>
                  <button 
                    onClick={() => onReject(req.id)}
                    className="bg-red-400 text-black border-2 border-black w-8 h-8 flex items-center justify-center rounded-sm shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all cursor-pointer"
                    title="Rechazar"
                  >
                    <XCircle size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="bg-white border-4 border-black p-4 rounded-sm shadow-[4px_4px_0px_0px_#000] max-w-[250px]">
              <p className="font-bold text-black mb-1">No tienes solicitudes</p>
              <p className="text-xs text-gray-600 font-semibold">Usa el buscador para encontrar nuevos amigos.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendRequestsModal;
