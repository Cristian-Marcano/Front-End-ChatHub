import { forwardRef, useState } from 'react';

const InputField = forwardRef(({ name, type, placeholder, error, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="relative w-full">
        <input
          ref={ref}
          name={name}
          type={inputType}
          placeholder={placeholder}
          className={`w-full h-12 px-4 ${isPassword ? 'pr-12' : ''} rounded-sm border-2 bg-white shadow-[4px_4px_0px_0px_#000] text-black font-semibold placeholder:text-gray-600 focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-colors ${
            error ? 'border-red-500 focus:border-red-600' : 'border-black focus:border-primary'
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xl focus:outline-none cursor-pointer hover:scale-110 transition-transform"
            title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {error && <span className="text-sm font-bold text-red-600">{error.message}</span>}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;
