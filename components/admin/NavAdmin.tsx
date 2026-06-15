"use client";

import { usePathname } from "next/navigation";

const enlaces = [
  { href: "/admin", texto: "Inicio" },
  { href: "/admin/reservas", texto: "Reservas" },
  { href: "/admin/caballos", texto: "Caballos" },
  { href: "/admin/galeria", texto: "Galería" },
];

export default function NavAdmin() {
  const path = usePathname();
  return (
    <nav className="mx-auto max-w-6xl px-5">
      <ul className="flex gap-1 -mb-px overflow-x-auto">
        {enlaces.map((e) => {
          const activo =
            e.href === "/admin" ? path === "/admin" : path.startsWith(e.href);
          return (
            <li key={e.href}>
              <a
                href={e.href}
                className={`inline-block px-4 py-2.5 text-sm uppercase tracking-wide font-slab border-b-2 transition-colors ${
                  activo
                    ? "border-atardecer text-atardecer"
                    : "border-transparent text-crema/70 hover:text-crema"
                }`}
              >
                {e.texto}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
