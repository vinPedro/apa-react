export default function Campo({ label, type = "text", value, onChange, autoComplete = "on", name, disabled, placeholder }) {
  return (
    <div>
      <label className="text-foreground">{label}</label><br />
      <input className="border rounded-sm border-foreground pt-[clamp(1.5px,2vw,3px)] pb-[clamp(2.5px,2vw,4.5px)] pl-2 min-w-[300px] max-w-[700px] w-full"

        name={name}
        autoComplete={autoComplete}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
}