export default function Textarea({ label, value, onChange, placeholder = "", rows = 4, name}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <textarea
        value={value}
        name={name}
        onChange={(e) => onChange(e)}
        placeholder={placeholder}
        rows={rows}
        className="w-full border border-gray-300 rounded-2xl p-3 shadow-[0_0_6px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
      />
    </div>
  );
}
