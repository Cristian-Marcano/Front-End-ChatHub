const InputField = ({ name, type, placeholder }) => (
  <input
    name={name}
    type={type}
    placeholder={placeholder}
    className="w-full h-12 px-4 rounded-sm border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000] text-black font-semibold placeholder:text-gray-600 focus:outline-none focus:border-primary focus:shadow-[4px_4px_0px_0px_#000] transition-colors"
  />
);

export default InputField;
