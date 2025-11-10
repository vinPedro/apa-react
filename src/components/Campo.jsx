export default function Campo({ label, type = "text", value, onChange, autoComplete = "on", name, disabled, placeholder, error }) {
  
  const errorClass = error ? 'border-red-500' : 'border-foreground';

  const baseClasses = "border rounded-sm pt-[clamp(1.5px,2vw,3px)] pb-[clamp(2.5px,2vw,4.5px)] pl-2 min-w-[300px] max-w-[700px] w-full";

  return (
    <div>
      <label className="text-foreground">{label}</label><br />
      <input 
        className={`${baseClasses} ${errorClass}`} // Combina as classes base com a classe de erro/sucesso
        name={name}
        autoComplete={autoComplete}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
      />
      
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}