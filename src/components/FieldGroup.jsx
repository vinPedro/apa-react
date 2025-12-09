export default function FieldGroup({ title, children }) {
  return (
    <fieldset className="p-4 border rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.08)]">
      {title && (
        <legend className="text-sm font-semibold px-1">{title}</legend>
      )}

      <div className="flex flex-col gap-3 mt-3">
        {children}
      </div>
    </fieldset>
  );
}
