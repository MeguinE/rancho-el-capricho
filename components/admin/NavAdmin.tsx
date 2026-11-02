"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const enlaces = [
  { href: "/admin", texto: "Inicio" },
  { href: "/admin/reservas", texto: "Reservas" },
  { href: "/admin/caballos", texto: "Caballos" },
  { href: "/admin/galeria", texto: "Galería" },
];

/** Pestañas del panel. */
export default function NavAdmin() {
  const ruta = usePathname();

  return (
    <nav aria-label="Secciones del panel" className="mx-auto max-w-6xl px-5">
      <ul className="flex gap-1 -mb-px overflow-x-auto">
        {enlaces.map((e) => {
          // "/admin" solo está activo en su propia ruta; el resto también en
          // sus subrutas.
          const activo =
            e.href === "/admin" ? ruta === "/admin" : ruta.startsWith(e.href);

          return (
            <li key={e.href}>
              <Link
                href={e.href}
                aria-current={activo ? "page" : undefined}
                className={`inline-block px-4 py-3 text-sm uppercase tracking-[0.1em] font-slab border-b-2 transition-colors ${
                  activo
                    ? "border-atardecer text-atardecer"
                    : "border-transparent text-crema/60 hover:text-crema hover:border-cuero/60"
                }`}
              >
                {e.texto}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
