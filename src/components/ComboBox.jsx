

"use client";

import { useState } from "react";


export default function ComboBox({ label, name, options = [], value, onChange }) {
  const [open, setOpen] = useState(false);
  

  const displayText = options.find(option => option.value === value)?.text || "Selecione...";

  const handleSelect = (option) => {
    
    onChange(option.value); 
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1 relative w-full">
      {label && <label className="text-foreground">{label}</label>}
      
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="border border-foreground rounded-sm px-2 py-2 text-left"
      >
        {displayText}
      </button>

      {open && (
        <ul className="absolute top-full mt-1 w-full border border-foreground bg-background rounded-md shadow-md z-10 max-h-48 overflow-y-auto">
          {options.length === 0 && (
            <li className="px-2 py-1 text-muted">Nenhum item</li>
          )}

          {options.map((option) => ( // Itera sobre { value, text }
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className="px-2 py-1 hover:bg-accent cursor-pointer"
            >
              {option.text} {/* Exibe o texto */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}