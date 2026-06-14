"use client";

import { useState, useEffect } from "react";

const enlaces = [
  { href: "#inicio", texto: "Inicio" },
  { href: "#caballos", texto: "Caballos" },
  { href: "#servicios", texto: "Eventos" },
  { href: "#galeria", texto: "Galería" },
  { href: "#reservar", texto: "Reservar" },
];

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const [solido, setSolido] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolido(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        solido
          ? "bg-[#1a1410]/95 backdrop-blur shadow-lg border-b border-cuero/40"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between">
        <a
          href="#inicio"
          className="font-[family-name:var(--font-display)] text-cuero-claro text-xl sm:text-2xl tracking-wide"
        >
          Rancho el Capricho
        </a>

        <ul className="hidden md:flex items-center gap-7">
          {enlaces.map((e) => (
            <li key={e.href}>
              <a
                href={e.href}
                className="text-crema/85 hover:text-atardecer uppercase text-sm tracking-widest transition-colors"
              >
                {e.texto}
              </a>
            </li>
          ))}
          <li>
            <a href="#reservar" className="btn-rancho !py-2 !px-5 text-sm">
              Reservar
            </a>
          </li>
        </ul>

        <button
          aria-label="Abrir menú"
          className="md:hidden text-crema text-3xl leading-none"
          onClick={() => setAbierto((v) => !v)}
        >
          {abierto ? "✕" : "☰"}
        </button>
      </nav>

      {abierto && (
        <ul className="md:hidden bg-[#1a1410]/98 border-t border-cuero/40 px-5 py-4 flex flex-col gap-4">
          {enlaces.map((e) => (
            <li key={e.href}>
              <a
                href={e.href}
                onClick={() => setAbierto(false)}
                className="block text-crema/90 hover:text-atardecer uppercase text-sm tracking-widest"
              >
                {e.texto}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
