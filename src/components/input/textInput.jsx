const TextInput = ({ label, name, handleChange, value, type, required }) => {
  return (
    <div className="input">
      {label && <p className="label">{label}</p>}
      <input
        value={value}
        type={type}
        required={required}
        onChange={(e) => handleChange(e.target.value, name)}
      />
    </div>
  );
};

export default TextInput;
