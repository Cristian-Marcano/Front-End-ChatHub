const InputField = ({ name, type, placeholder }) => (
  <input
    className="form-input"
    name={name}
    type={type}
    placeholder={placeholder}
  />
);

export default InputField;