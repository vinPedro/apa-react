'use client';
import { useState } from "react";

function SidebarGroup({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="
          w-full flex justify-between items-center
          p-2 rounded
          hover:bg-blue-800
          font-medium
        "
      >
        <span>{title}</span>
        <span className="text-sm">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <ul className="ml-4 mt-2 space-y-1">
          {children}
        </ul>
      )}
    </li>
  );
}

export default SidebarGroup;
