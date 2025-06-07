import { forwardRef } from 'react';

const InputField = forwardRef(({ name, type, placeholder, error, ...props }, ref) => (
  <div className="flex flex-col gap-1 w-full">
    <input
      ref={ref}
      name={name}
      type={type}
      placeholder={placeholder}
      className={`w-full h-12 px-4 rounded-sm border-2 bg-white shadow-[4px_4px_0px_0px_#000] text-black font-semibold placeholder:text-gray-600 focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-colors ${
        error ? 'border-red-500 focus:border-red-600' : 'border-black focus:border-primary'
      }`}
      {...props}
    />
    {error && <span className="text-sm font-bold text-red-600">{error.message}</span>}
  </div>
));

InputField.displayName = 'InputField';

export default InputField;
