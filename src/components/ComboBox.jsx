"use client";

import { useState } from "react";

export default function ComboBox({ label, name, options = [], value, onChange }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (item) => {
    onChange(name, item);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1 relative w-full">
      {label && <label className="text-foreground">{label}</label>}
      
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="border border-foreground rounded-sm px-2 py-1 text-left"
      >
        {value || "Selecione..."}
      </button>

      {open && (
        <ul className="absolute mt-1 w-full border border-foreground bg-background rounded-md shadow-md z-10 max-h-48 overflow-y-auto">
          {options.length === 0 && (
            <li className="px-2 py-1 text-muted">Nenhum item</li>
          )}

          {options.map((item) => (
            <li
              key={item}
              onClick={() => handleSelect(item)}
              className="px-2 py-1 hover:bg-accent cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
