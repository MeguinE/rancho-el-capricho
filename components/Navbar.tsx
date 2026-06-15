"use client";

import { useState, useEffect } from "react";
import Icono from "@/components/Icono";

const enlaces = [
  { href: "#inicio", texto: "Inicio" },
  { href: "#historia", texto: "El Rancho" },
  { href: "#caballos", texto: "Caballos" },
  { href: "#servicios", texto: "Eventos" },
  { href: "#galeria", texto: "Galería" },
];

export default function Navbar({ logoUrl }: { logoUrl?: string | null }) {
  const [abierto, setAbierto] = useState(false);
  const [solido, setSolido] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [activo, setActivo] = useState("#inicio");

  // Fondo sólido + barra de progreso al hacer scroll
  useEffect(() => {
    const onScroll = () => {
      const top = window.scrollY;
      setSolido(top > 40);
      const alto = document.body.scrollHeight - window.innerHeight;
      setProgreso(alto > 0 ? (top / alto) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: resalta la sección visible
  useEffect(() => {
    const secciones = enlaces
      .map((e) => document.getElementById(e.href.slice(1)))
      .filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActivo(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    secciones.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // Bloquea el scroll del fondo cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        solido || abierto
          ? "bg-[#1a1410]/90 backdrop-blur-md shadow-lg border-b border-cuero/40"
          : "bg-gradient-to-b from-black/40 to-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-5 h-28 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#inicio"
          className="group flex items-center gap-3"
          onClick={() => setAbierto(false)}
        >
          {logoUrl ? (
            // El logo ya incluye el nombre; lo mostramos completo sobre una
            // placa clara para que su texto oscuro se lea en el navbar oscuro.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt="Rancho el Capricho"
              className="h-[88px] sm:h-[104px] w-auto object-contain group-hover:scale-105 transition-transform"
            />
          ) : (
            <>
              <span className="flex items-center justify-center w-10 h-10 rounded-full border border-cuero-claro/50 text-atardecer group-hover:border-atardecer transition-all">
                <Icono
                  name="herradura"
                  className="w-5 h-5 group-hover:rotate-12 transition-transform"
                />
              </span>
              <span className="leading-none">
                <span className="block font-slab font-bold uppercase text-lg sm:text-xl tracking-[0.08em] text-crema group-hover:text-cuero-claro transition-colors">
                  Rancho el Capricho
                </span>
                <span className="block text-[10px] uppercase tracking-[0.32em] text-crema/50 mt-0.5">
                  Caballos & Eventos
                </span>
              </span>
            </>
          )}
        </a>

        {/* Enlaces escritorio */}
        <ul className="hidden md:flex items-center gap-8">
          {enlaces.map((e) => (
            <li key={e.href}>
              <a
                href={e.href}
                className={`relative font-slab uppercase text-sm tracking-[0.12em] transition-colors after:absolute after:left-0 after:-bottom-1.5 after:h-[2px] after:bg-atardecer after:transition-all hover:text-atardecer ${
                  activo === e.href
                    ? "text-atardecer after:w-full"
                    : "text-crema/85 after:w-0 hover:after:w-full"
                }`}
              >
                {e.texto}
              </a>
            </li>
          ))}
          <li>
            <a href="#reservar" className="btn-pill">
              Reservar
            </a>
          </li>
        </ul>

        {/* Botón menú móvil (hamburguesa animada) */}
        <button
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={abierto}
          className="md:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setAbierto((v) => !v)}
        >
          <span
            className={`block h-0.5 w-7 bg-crema transition-all duration-300 ${
              abierto ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-7 bg-crema transition-all duration-300 ${
              abierto ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-7 bg-crema transition-all duration-300 ${
              abierto ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Barra de progreso de lectura */}
      <div
        className="h-[3px] bg-atardecer transition-[width] duration-150 ease-out"
        style={{ width: `${progreso}%` }}
      />

      {/* Menú móvil a pantalla completa */}
      <div
        className={`md:hidden fixed inset-0 top-[115px] bg-[#1a1410]/98 backdrop-blur-md transition-all duration-300 ${
          abierto
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col items-center justify-center gap-7 h-full -mt-16">
          {enlaces.map((e, i) => (
            <li
              key={e.href}
              style={{ transitionDelay: abierto ? `${i * 60 + 100}ms` : "0ms" }}
              className={`transition-all duration-300 ${
                abierto ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <a
                href={e.href}
                onClick={() => setAbierto(false)}
                className={`font-slab font-semibold uppercase tracking-[0.1em] text-3xl ${
                  activo === e.href ? "text-atardecer" : "text-crema"
                }`}
              >
                {e.texto}
              </a>
            </li>
          ))}
          <li
            style={{ transitionDelay: abierto ? "400ms" : "0ms" }}
            className={`mt-4 transition-all duration-300 ${
              abierto ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <a
              href="#reservar"
              onClick={() => setAbierto(false)}
              className="btn-pill !text-sm !px-7 !py-3"
            >
              Reservar caballos
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
