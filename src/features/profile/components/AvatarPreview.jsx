import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import * as initials from '@dicebear/initials';
import { 
  adventurer, dylan, lorelei, micah, miniavs, 
  notionists, openPeeps, personas, pixelArt, toonHead 
} from '@dicebear/collection';

const STYLES = {
  adventurer, dylan, lorelei, micah, miniavs, 
  notionists, openPeeps, personas, pixelArt, toonHead 
};

export const AvatarPreview = ({ config, name, className = '' }) => {
  const svgUri = useMemo(() => {
    if (config && STYLES[config.style]) {
      return createAvatar(STYLES[config.style], {
        seed: config.seed,
        backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
      }).toDataUri();
    }
    
    // Default to initials
    return createAvatar(initials, {
      seed: name || 'Usuario',
      backgroundColor: ['e2e8f0', 'cbd5e1', '94a3b8'],
      textColor: ['000000'],
      fontWeight: 800
    }).toDataUri();
  }, [config, name]);

  return (
    <div className={`border-4 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden bg-white shrink-0 flex items-center justify-center p-0 m-0 ${className}`}>
      <img src={svgUri} alt="Avatar" className="w-full h-full object-cover block" />
    </div>
  );
};
