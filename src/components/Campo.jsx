export default function Campo({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  onBlur, 
  autoComplete = "on", 
  name, 
  disabled, 
  placeholder, 
  error,
  maxLength, 
  className 
}) {
  
  const errorClass = error ? 'border-red-500' : 'border-foreground';
  const disabledClass = disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white';

  // REMOVIDO: "min-w-[300px]" que causava o estouro do layout.
  // MANTIDO: "w-full" para ocupar 100% do espaço da coluna onde ele estiver.
  const baseClasses = "border rounded-sm pt-[clamp(1.5px,2vw,3px)] pb-[clamp(2.5px,2vw,4.5px)] pl-2 w-full transition-colors";

  return (
    <div className={`w-full ${className || ''}`}>
      <label className="text-foreground font-medium text-sm">{label}</label><br />
      <input 
        className={`${baseClasses} ${errorClass} ${disabledClass}`} 
        name={name}
        autoComplete={autoComplete}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur} 
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      
      {error && <span className="text-red-500 text-xs mt-1 block">{error}</span>}
    </div>
  );
}