import { useState, useEffect } from 'react';
import { createAvatar } from '@dicebear/core';
import { 
  adventurer, dylan, lorelei, micah, miniavs, 
  notionists, openPeeps, personas, pixelArt, toonHead 
} from '@dicebear/collection';
import { Dices, Check, X } from 'lucide-react';

const STYLES = {
  adventurer: { name: 'Adventurer', module: adventurer },
  dylan: { name: 'Dylan', module: dylan },
  lorelei: { name: 'Lorelei', module: lorelei },
  micah: { name: 'Micah', module: micah },
  miniavs: { name: 'Miniavs', module: miniavs },
  notionists: { name: 'Notionists', module: notionists },
  openPeeps: { name: 'Open Peeps', module: openPeeps },
  personas: { name: 'Personas', module: personas },
  pixelArt: { name: 'Pixel Art', module: pixelArt },
  toonHead: { name: 'Toon Head', module: toonHead },
};

const AvatarEditor = ({ initialConfig, onSave, onCancel }) => {
  const [currentStyle, setCurrentStyle] = useState(initialConfig?.style || 'lorelei');
  const [currentSeed, setCurrentSeed] = useState(initialConfig?.seed || Math.random().toString(36).substring(7));
  const [svgContent, setSvgContent] = useState('');

  // Generar Avatar usando DiceBear
  useEffect(() => {
    const avatar = createAvatar(STYLES[currentStyle].module, {
      seed: currentSeed,
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
    });
    setSvgContent(avatar.toDataUri());
  }, [currentStyle, currentSeed]);

  const handleRandomize = () => {
    setCurrentSeed(Math.random().toString(36).substring(7));
  };

  const handleSave = () => {
    onSave({ style: currentStyle, seed: currentSeed });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_#000] w-full max-w-md p-6 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b-4 border-black pb-4">
          <h2 className="text-2xl font-black text-black">Editor de Avatar</h2>
          <button 
            onClick={onCancel}
            className="text-black hover:scale-110 transition-transform cursor-pointer"
          >
            <X size={32} />
          </button>
        </div>

        {/* Vista Previa */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 border-4 border-black rounded-sm shadow-[4px_4px_0px_0px_#000] overflow-hidden bg-gray-100 flex items-center justify-center p-0 m-0">
            {svgContent && <img src={svgContent} alt="Avatar Preview" className="w-full h-full object-cover block" />}
          </div>
          <button 
            type="button"
            onClick={handleRandomize}
            className="flex items-center gap-2 bg-yellow-300 border-2 border-black px-4 py-2 font-bold text-black rounded-sm shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all cursor-pointer"
          >
            <Dices size={20} /> Aleatorio
          </button>
        </div>

        {/* Selector de Estilo */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm text-black">Estilo de Avatar:</label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border-2 border-black bg-gray-100">
            {Object.entries(STYLES).map(([key, styleData]) => (
              <button
                key={key}
                type="button"
                onClick={() => setCurrentStyle(key)}
                className={`text-sm font-bold p-2 border-2 border-black rounded-sm cursor-pointer transition-colors ${
                  currentStyle === key 
                    ? 'bg-blue-400 text-white shadow-[2px_2px_0px_0px_#000]' 
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                {styleData.name}
              </button>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-4 mt-2">
          <button 
            onClick={onCancel}
            className="flex-1 bg-white border-2 border-black py-3 font-black text-black rounded-sm shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 bg-green-400 border-2 border-black py-3 font-black text-black rounded-sm shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer"
          >
            <Check size={20} /> Guardar
          </button>
        </div>

      </div>
    </div>
  );
};

export default AvatarEditor;
