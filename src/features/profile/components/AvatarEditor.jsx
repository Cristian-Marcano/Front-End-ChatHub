import { useState, useEffect } from 'react';
import { createAvatar } from '@dicebear/core';
import { 
  adventurer, dylan, lorelei, micah, miniavs, 
  notionists, openPeeps, personas, pixelArt, toonHead 
} from '@dicebear/collection';
import { Dices, Check, X, Sparkles, Ban, ChevronDown } from 'lucide-react';

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

// Custom Select Component for Neo-Brutalism + Lucide Icons
const CustomSelect = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div className="relative w-full">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border-4 border-black font-bold bg-white shadow-[4px_4px_0px_0px_#000] flex justify-between items-center hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
      >
        <span className="flex items-center gap-2">{selectedOption.icon} {selectedOption.label}</span>
        <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-full bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] z-20 max-h-48 overflow-y-auto flex flex-col">
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`p-3 text-left font-bold border-b-2 border-black last:border-b-0 hover:bg-gray-200 flex items-center gap-2 cursor-pointer ${value === opt.value ? 'bg-gray-200' : ''}`}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
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
      backgroundColor: customOptions.backgroundColor || ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
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
    
    // Convert elements to render array
    const elements = [];

    // Manually add background color picker
    const currentBg = customOptions.backgroundColor?.[0] || 'RANDOM';
    const displayBg = currentBg !== 'RANDOM' && currentBg !== 'transparent' ? `#${currentBg}` : '#ffffff';

    elements.push(
      <div key="backgroundColor" className="flex flex-col gap-2 mb-4 col-span-1 lg:col-span-2">
        <label className="font-black text-black capitalize">Fondo (Background)</label>
        <div className="flex flex-wrap items-center gap-4 p-2 border-4 border-black bg-white shadow-[4px_4px_0px_0px_#000]">
          <button 
            onClick={() => handleOptionChange('backgroundColor', 'RANDOM')}
            className={`flex items-center gap-2 px-4 py-2 font-bold border-2 border-black rounded-sm cursor-pointer hover:-translate-y-1 transition-transform ${currentBg === 'RANDOM' ? 'bg-black text-white' : 'bg-gray-200'}`}
            title="Aleatorio"
          >
            <Sparkles size={16} /> Aleatorio
          </button>
          
          <button 
            onClick={() => handleOptionChange('backgroundColor', 'transparent')}
            className={`flex items-center gap-2 px-4 py-2 font-bold border-2 border-black rounded-sm cursor-pointer hover:-translate-y-1 transition-transform ${currentBg === 'transparent' ? 'ring-4 ring-black ring-offset-2 bg-gray-100' : 'bg-white'}`}
            title="Transparente"
          >
            <div className="w-4 h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjY2NjIi8+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNjY2MiLz4KPC9zdmc+')] border border-black" /> Transparente
          </button>

          <div className="flex items-center gap-2 border-l-4 border-black pl-4">
            <input 
              type="color"
              value={displayBg}
              onChange={(e) => handleOptionChange('backgroundColor', e.target.value.replace('#', ''))}
              className="w-10 h-10 cursor-pointer p-0"
              title="Color personalizado"
            />
            <span className="font-bold text-sm uppercase">{currentBg !== 'RANDOM' && currentBg !== 'transparent' ? displayBg : 'Escoger'}</span>
          </div>
        </div>
      </div>
    );

    keys.forEach(key => {
      const prop = schema[key];
      const hasProbability = !!schema[`${key}Probability`];
      
      // Select for Enums
      if (prop.items?.enum) {
        const variants = prop.items.enum;
        const currentVal = customOptions[key]?.[0];
        const isNone = customOptions[`${key}Probability`] === 0;
        
        const options = [
          { value: 'RANDOM', label: 'Aleatorio', icon: <Dices size={16} /> }
        ];
        if (hasProbability) {
          options.push({ value: 'NONE', label: 'Ninguno', icon: <Ban size={16} className="text-red-500" /> });
        }
        variants.forEach(v => {
          options.push({ value: v, label: v, icon: null });
        });

        elements.push(
          <div key={key} className="flex flex-col gap-2 mb-2">
            <label className="font-black text-black capitalize">{key}</label>
            <CustomSelect 
              options={options} 
              value={isNone ? 'NONE' : currentVal || 'RANDOM'}
              onChange={(val) => handleOptionChange(key, val)}
            />
          </div>
        );
      }

      // Color Picker for colors
      else if (key.toLowerCase().includes('color') || prop.items?.pattern) {
        const currentVal = customOptions[key]?.[0];
        const displayColor = currentVal && currentVal !== 'transparent' ? `#${currentVal}` : '#ffffff';
        
        elements.push(
          <div key={key} className="flex flex-col gap-2 mb-2">
            <label className="font-black text-black capitalize">{key}</label>
            <div className="flex flex-wrap items-center gap-4 p-2 border-4 border-black bg-white shadow-[4px_4px_0px_0px_#000]">
              <button 
                onClick={() => handleOptionChange(key, 'RANDOM')}
                className={`flex gap-2 items-center px-4 py-2 font-bold border-2 border-black rounded-sm cursor-pointer hover:-translate-y-1 transition-transform ${!currentVal ? 'bg-black text-white' : 'bg-gray-200'}`}
                title="Aleatorio"
              >
                <Sparkles size={16} /> Aleatorio
              </button>
              
              <div className="flex items-center gap-2 border-l-4 border-black pl-4">
                <input 
                  type="color"
                  value={displayColor}
                  onChange={(e) => handleOptionChange(key, e.target.value.replace('#', ''))}
                  className="w-10 h-10 cursor-pointer p-0"
                  title="Elegir Color"
                />
                <span className="font-bold text-sm uppercase">{currentVal && currentVal !== 'transparent' ? displayColor : 'Hex'}</span>
              </div>
            </div>
          </div>
        );
      }
    });

    return elements;
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
          <div className="w-full md:w-2/3 p-6 overflow-y-auto bg-bg-light relative">
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
