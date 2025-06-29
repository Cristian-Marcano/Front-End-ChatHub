import { useState, useEffect } from 'react';
import { createAvatar } from '@dicebear/core';
import { 
  adventurer, dylan, lorelei, micah, miniavs, 
  notionists, openPeeps, personas, pixelArt, toonHead 
} from '@dicebear/collection';
import { Dices, Check, X, Sparkles } from 'lucide-react';

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
  const [customOptions, setCustomOptions] = useState(initialConfig?.options || {});
  const [svgContent, setSvgContent] = useState('');

  const schema = STYLES[currentStyle].module.schema.properties;

  // Generar Avatar usando DiceBear
  useEffect(() => {
    const avatar = createAvatar(STYLES[currentStyle].module, {
      seed: currentSeed,
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
      ...customOptions
    });
    setSvgContent(avatar.toDataUri());
  }, [currentStyle, currentSeed, customOptions]);

  const handleRandomize = () => {
    setCurrentSeed(Math.random().toString(36).substring(7));
    setCustomOptions({});
  };

  const handleStyleChange = (styleKey) => {
    setCurrentStyle(styleKey);
    setCustomOptions({});
  };

  const handleOptionChange = (key, value) => {
    setCustomOptions(prev => {
      const newOpts = { ...prev };
      if (value === 'NONE') {
        newOpts[`${key}Probability`] = 0;
        delete newOpts[key];
      } else if (value === 'RANDOM') {
        delete newOpts[key];
        delete newOpts[`${key}Probability`];
      } else {
        newOpts[key] = [value];
        if (schema[`${key}Probability`]) {
          newOpts[`${key}Probability`] = 100;
        }
      }
      return newOpts;
    });
  };

  const renderDynamicOptions = () => {
    const keys = Object.keys(schema).filter(k => k !== 'base' && !k.endsWith('Probability') && k !== 'backgroundColor');
    
    return keys.map(key => {
      const prop = schema[key];
      const hasProbability = !!schema[`${key}Probability`];
      
      // Select for Enums
      if (prop.items?.enum) {
        const variants = prop.items.enum;
        const currentVal = customOptions[key]?.[0];
        const isNone = customOptions[`${key}Probability`] === 0;
        
        return (
          <div key={key} className="flex flex-col gap-2">
            <label className="font-black text-black capitalize">{key}</label>
            <select 
               className="p-3 border-4 border-black font-bold focus:outline-none bg-white shadow-[4px_4px_0px_0px_#000] cursor-pointer"
               value={isNone ? 'NONE' : currentVal || 'RANDOM'}
               onChange={(e) => handleOptionChange(key, e.target.value)}
            >
               <option value="RANDOM">🎲 Aleatorio</option>
               {hasProbability && <option value="NONE">❌ Ninguno</option>}
               {variants.map(v => (
                 <option key={v} value={v}>{v}</option>
               ))}
            </select>
          </div>
        );
      }

      // Color Picker for colors
      if (key.toLowerCase().includes('color') || prop.items?.pattern) {
        const colors = prop.default || [];
        const currentVal = customOptions[key]?.[0];
        return (
          <div key={key} className="flex flex-col gap-2">
            <label className="font-black text-black capitalize">{key}</label>
            <div className="flex flex-wrap gap-2 p-2 border-4 border-black bg-white shadow-[4px_4px_0px_0px_#000]">
              <button 
                onClick={() => handleOptionChange(key, 'RANDOM')}
                className={`w-8 h-8 flex items-center justify-center border-2 border-black rounded-full cursor-pointer hover:-translate-y-1 transition-transform ${!currentVal ? 'bg-black text-white' : 'bg-gray-200'}`}
                title="Aleatorio"
              >
                <Sparkles size={16} />
              </button>
              {colors.map(color => {
                const hex = color === 'transparent' ? 'transparent' : `#${color}`;
                const isSelected = currentVal === color;
                return (
                  <button
                    key={color}
                    onClick={() => handleOptionChange(key, color)}
                    className={`w-8 h-8 rounded-full border-2 border-black cursor-pointer hover:-translate-y-1 transition-transform ${isSelected ? 'ring-4 ring-black ring-offset-2' : ''}`}
                    style={{ backgroundColor: hex }}
                    title={color}
                  />
                )
              })}
            </div>
          </div>
        )
      }
      return null;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-bg-light border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_#000] w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b-4 border-black p-4 bg-white shrink-0">
          <h2 className="text-2xl font-black text-black">Avatar Builder Pro</h2>
          <div className="flex gap-4">
            <button 
              onClick={onCancel}
              className="px-4 py-2 bg-red-400 border-2 border-black font-bold flex gap-2 items-center rounded-sm shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all cursor-pointer"
            >
              <X size={20} /> Cancelar
            </button>
            <button 
              onClick={() => onSave({ style: currentStyle, seed: currentSeed, options: customOptions })}
              className="px-4 py-2 bg-green-400 border-2 border-black font-bold flex gap-2 items-center rounded-sm shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all cursor-pointer"
            >
              <Check size={20} /> Guardar Avatar
            </button>
          </div>
        </div>

        {/* Body Layout */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          
          {/* Left Column: Preview */}
          <div className="w-full md:w-1/3 border-r-4 border-black bg-white p-6 flex flex-col items-center gap-6 overflow-y-auto shrink-0">
            <div className="w-full max-w-[250px] aspect-square border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_#000] overflow-hidden bg-gray-100 flex items-center justify-center p-0 m-0">
              {svgContent && <img src={svgContent} alt="Avatar Preview" className="w-full h-full object-cover block" />}
            </div>
            
            <button 
              type="button"
              onClick={handleRandomize}
              className="w-full max-w-[250px] flex items-center justify-center gap-2 bg-yellow-300 border-4 border-black px-6 py-4 font-black text-xl text-black rounded-sm shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all cursor-pointer"
            >
              <Dices size={28} /> Dado Suerte
            </button>

            <div className="w-full mt-4">
              <label className="font-black text-black mb-2 block">Cambiar Estilo Base:</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(STYLES).map(([key, styleData]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleStyleChange(key)}
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
          </div>

          {/* Right Column: Customization Form */}
          <div className="w-full md:w-2/3 p-6 overflow-y-auto bg-bg-light">
            <div className="bg-yellow-300 border-4 border-black p-4 mb-6 rounded-sm shadow-[4px_4px_0px_0px_#000]">
              <h3 className="font-black text-xl">Personalización Detallada</h3>
              <p className="font-bold text-gray-800">Usa las opciones abajo para sobrescribir los valores aleatorios de la semilla actual.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
              {renderDynamicOptions()}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AvatarEditor;
