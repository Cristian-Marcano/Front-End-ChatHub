import { useRef } from 'react';

export const OTPInput = ({ length = 6, value = '', onChange, disabled = false }) => {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    
    // Solo permitir números
    if (val && !/^\d+$/.test(val)) return;

    // Solo tomar el último carácter ingresado si hay más de uno
    const char = val.slice(-1);

    const newValue = value.split('');
    newValue[index] = char;
    onChange(newValue.join(''));

    // Auto-focus al siguiente input
    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Si está vacío y se presiona Backspace, ir al anterior y borrar
        const newValue = value.split('');
        newValue[index - 1] = '';
        onChange(newValue.join(''));
        inputsRef.current[index - 1]?.focus();
      } else {
        // Si tiene contenido, simplemente lo borra
        const newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join(''));
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
    if (pastedData) {
      onChange(pastedData);
      // Focus the next empty input or the last one
      const nextIndex = Math.min(pastedData.length, length - 1);
      inputsRef.current[nextIndex]?.focus();
    }
  };

  // Ensure value array has exact length
  const valueArray = Array.from({ length }, (_, i) => value[i] || '');

  return (
    <div className="flex gap-2 justify-between">
      {valueArray.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={2}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-12 h-14 md:w-14 md:h-16 text-center text-xl md:text-2xl font-black bg-bg-light border-2 border-black rounded-sm shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:translate-y-1 focus:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50"
        />
      ))}
    </div>
  );
};
