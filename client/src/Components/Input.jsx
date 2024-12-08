const Input = ({
  type,
  placeholder,
  readonly = false,
  value,
  name,
  onChange,
  className,
}) => {
  const handleChange = (e) => {
    onChange(e);
  };

  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        readOnly={readonly}
        value={value}
        name={name}
        onChange={(e) => handleChange(e)}
        className={`w-full text-sm px-4 py-2 outline-none rounded-lg ${className}`}
      />
    </>
  );
};

export default Input;

export const Input2 = ({
  type = "text",
  name,
  placeholder,
  value,
  required = false,
  onChange,
  className,
}) => {
  return (
    <>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={(e) => onChange(e)}
        className={`w-full text-black text-lg outline-none rounded-sm pl-3 py-1 ${className}`}
        style={{
          backgroundColor: "hsl(0, 0%, 80%)",
        }}
      />
    </>
  );
};
