import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/initials';
import { 
  adventurer, dylan, lorelei, micah, miniavs, 
  notionists, openPeeps, personas, pixelArt, toonHead 
} from '@dicebear/collection';

const STYLES = {
  adventurer, dylan, lorelei, micah, miniavs, 
  notionists, openPeeps, personas, pixelArt, toonHead 
};

export const AvatarPreview = ({ config, name, className = '' }) => {
  const svg = useMemo(() => {
    if (config && STYLES[config.style]) {
      return createAvatar(STYLES[config.style], {
        seed: config.seed,
        size: 128,
        backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
      }).toString();
    }
    
    // Default to initials
    return createAvatar(initials, {
      seed: name || 'Usuario',
      size: 128,
      backgroundColor: ['e2e8f0', 'cbd5e1', '94a3b8'],
      textColor: ['000000'],
      fontWeight: 800
    }).toString();
  }, [config, name]);

  return (
    <div 
      className={`border-4 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden bg-white shrink-0 ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};
