"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Icono from "@/components/Icono";
import Dialogo from "@/components/Dialogo";

const enlaces = [
  { href: "#historia", texto: "El Rancho" },
  { href: "#caballos", texto: "Caballos" },
  { href: "#servicios", texto: "Eventos" },
  { href: "#galeria", texto: "Galería" },
  { href: "#testimonios", texto: "Opiniones" },
];

export default function Navbar({ logoUrl }: { logoUrl?: string | null }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [compacta, setCompacta] = useState(false);
  const [activo, setActivo] = useState<string | null>(null);

  // Encoge la barra al despegarse del borde superior.
  //
  // El único dato que necesitamos del scroll es "¿pasamos de 60px?", así que
  // agrupamos las lecturas en un requestAnimationFrame: por muchos eventos que
  // dispare el navegador, medimos una vez por fotograma. La barra de progreso
  // no está aquí: la dibuja el CSS con animation-timeline.
  useEffect(() => {
    let pendiente = false;

    const alHacerScroll = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        setCompacta(window.scrollY > 60);
        pendiente = false;
      });
    };

    alHacerScroll();
    window.addEventListener("scroll", alHacerScroll, { passive: true });
    return () => window.removeEventListener("scroll", alHacerScroll);
  }, []);

  // Resalta en el menú la sección que el visitante está mirando.
  useEffect(() => {
    const secciones = enlaces
      .map((e) => document.getElementById(e.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    if (secciones.length === 0) return;

    const obs = new IntersectionObserver(
      (entradas) => {
        // Nos quedamos con la sección más visible, no con la última en entrar:
        // si no, al bajar rápido se queda marcada la que acabamos de dejar.
        const visible = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActivo(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    secciones.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const altoLogo = compacta ? 56 : 84;

  return (
    <header
      data-compacta={compacta ? "si" : "no"}
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ${
        compacta
          ? "bg-madera/92 backdrop-blur-xl border-b border-cuero/40 shadow-[0_10px_40px_rgba(0,0,0,0.45)]"
          : "bg-gradient-to-b from-black/55 via-black/20 to-transparent border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Navegación principal"
        className={`mx-auto max-w-7xl px-5 flex items-center justify-between gap-6 transition-[height] duration-500 ease-[var(--ease-salida)] ${
          compacta ? "h-20" : "h-28"
        }`}
      >
        <Marca logoUrl={logoUrl} alto={altoLogo} />

        <ul className="hidden lg:flex items-center gap-9">
          {enlaces.map((e) => (
            <li key={e.href}>
              <a
                href={e.href}
                className="enlace-nav"
                aria-current={activo === e.href ? "true" : undefined}
              >
                {e.texto}
              </a>
            </li>
          ))}
          <li>
            <a href="#reservar" className="btn btn--pastilla">
              <Icono name="herradura" className="w-4 h-4" />
              Reservar
            </a>
          </li>
        </ul>

        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto(true)}
          className="lg:hidden flex flex-col items-end justify-center gap-[7px] w-11 h-11 group"
        >
          <span className="block h-[2px] w-8 bg-crema transition-all duration-300 group-hover:bg-atardecer" />
          <span className="block h-[2px] w-5 bg-crema transition-all duration-300 group-hover:w-8 group-hover:bg-atardecer" />
          <span className="block h-[2px] w-8 bg-crema transition-all duration-300 group-hover:bg-atardecer" />
        </button>
      </nav>

      {/* Progreso de lectura. La anchura la anima el CSS contra el scroll de la
          página; sin soporte simplemente se queda en cero y no molesta. */}
      <div
        aria-hidden="true"
        className="h-[3px] bg-gradient-to-r from-cuero via-atardecer to-dorado scrub-progreso"
      />

      <MenuMovil
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
        activo={activo}
      />
    </header>
  );
}

/** Logo o, si no hay, herradura con el nombre del rancho. */
function Marca({
  logoUrl,
  alto,
}: {
  logoUrl?: string | null;
  alto: number;
}) {
  return (
    <a
      href="#inicio"
      className="group flex items-center gap-3 shrink-0"
      aria-label="Rancho el Capricho, ir al inicio"
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt="Rancho el Capricho"
          width={320}
          height={160}
          priority
          sizes="320px"
          style={{ height: alto, width: "auto" }}
          className="object-contain transition-[height,transform] duration-500 ease-[var(--ease-salida)] group-hover:scale-[1.04]"
        />
      ) : (
        <>
          <span className="flex items-center justify-center w-11 h-11 rounded-full border border-cuero-claro/50 text-atardecer transition-colors duration-300 group-hover:border-atardecer">
            <Icono
              name="herradura"
              className="w-5 h-5 transition-transform duration-500 group-hover:rotate-[14deg]"
            />
          </span>
          <span className="leading-none">
            <span className="block font-slab font-bold uppercase text-lg sm:text-xl tracking-[0.07em] text-crema transition-colors duration-300 group-hover:text-cuero-claro">
              Rancho el Capricho
            </span>
            <span className="block text-[10px] uppercase tracking-[0.34em] text-crema/50 mt-1">
              Caballos & Eventos
            </span>
          </span>
        </>
      )}
    </a>
  );
}

/** Menú de pantalla completa para móvil y tableta. */
function MenuMovil({
  abierto,
  onCerrar,
  activo,
}: {
  abierto: boolean;
  onCerrar: () => void;
  activo: string | null;
}) {
  // El <dialog> nativo atrapa el foco, así que el primer enlace debe recibirlo.
  const primero = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (abierto) primero.current?.focus();
  }, [abierto]);

  return (
    <Dialogo
      abierto={abierto}
      onCerrar={onCerrar}
      titulo="Menú de navegación"
      variante="completo"
    >
      <div
        data-ver={abierto ? "si" : "no"}
        className="fondo-rancho h-full w-full flex flex-col px-6 py-7 overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <span className="antetitulo antetitulo--izq">Navegación</span>
          <button
            type="button"
            className="cerrar"
            onClick={onCerrar}
            aria-label="Cerrar menú"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        </div>

        <ul className="flex-1 flex flex-col justify-center gap-5">
          {enlaces.map((e, i) => (
            <li
              key={e.href}
              data-anim="izq"
              style={{ "--retardo": `${i * 70 + 90}ms` } as React.CSSProperties}
            >
              <a
                ref={i === 0 ? primero : undefined}
                href={e.href}
                onClick={onCerrar}
                className={`font-slab font-semibold uppercase tracking-[0.08em] text-[2rem] leading-tight transition-colors ${
                  activo === e.href ? "text-atardecer" : "text-crema"
                }`}
              >
                <span className="text-cuero-claro/50 text-base align-top mr-3">
                  0{i + 1}
                </span>
                {e.texto}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#reservar"
          onClick={onCerrar}
          className="btn btn--fuego w-full"
          data-anim="subir"
          style={{ "--retardo": "440ms" } as React.CSSProperties}
        >
          Reservar caballos
        </a>
      </div>
    </Dialogo>
  );
}
