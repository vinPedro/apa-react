"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function PrivateLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      
      {/* desktop sidebar */}
      <aside className="hidden md:flex flex-col border-r min-w-60 p-4 bg-primaria">
        <NavItems />
      </aside>

      {/* mobile button */}
      <button
        className="md:hidden p-2 absolute top-2 left-2 z-20"
        onClick={() => setOpen(true)}
      >
        <Menu />
      </button>

      {/* mobile sidebar overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* mobile sidebar drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-[90%] bg-primaria z-50 p-4 transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button className="p-2 mb-2" onClick={() => setOpen(false)}>
          <X />
        </button>

        <NavItems onItemClicked={() => setOpen(false)} />
      </aside>

      {/* main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

function NavItems({ onItemClicked }) {
  return (
    <nav className="flex flex-col gap-3">
      <button onClick={onItemClicked}>Home</button>
      <button onClick={onItemClicked}>Configurações</button>
      <button onClick={onItemClicked}>Perfil</button>
    </nav>
  );
}
