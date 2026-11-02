"use client";

import { useRef } from "react";
import Image from "next/image";
import type { ItemGaleria } from "@/lib/contenido";

type Props = {
  foto: ItemGaleria;
  posicion: number;
  total: number;
  onAnterior: () => void;
  onSiguiente: () => void;
  onCerrar: () => void;
};

/** Contenido del visor: la foto en grande, el contador y los controles. */
export default function VisorFoto({
  foto,
  posicion,
  total,
  onAnterior,
  onSiguiente,
  onCerrar,
}: Props) {
  const inicioX = useRef<number | null>(null);

  return (
    <div
      className="relative h-full w-full flex flex-col bg-carbon/96"
      // Arrastre horizontal para pasar de foto en pantallas táctiles.
      onPointerDown={(e) => {
        inicioX.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (inicioX.current === null) return;
        const recorrido = e.clientX - inicioX.current;
        inicioX.current = null;
        if (Math.abs(recorrido) < 55) return;
        if (recorrido < 0) onSiguiente();
        else onAnterior();
      }}
    >
      <header className="flex items-center justify-between gap-4 px-5 py-4 shrink-0">
        <p className="placa text-[0.62rem] text-crema/80" aria-live="polite">
          {posicion} / {total}
        </p>
        <button
          type="button"
          className="cerrar"
          onClick={onCerrar}
          aria-label="Cerrar visor"
        >
          <Cruz />
        </button>
      </header>

      <figure className="relative flex-1 min-h-0 mx-4 mb-2">
        {/* `key` fuerza un elemento nuevo por foto para que la entrada se
            vuelva a animar al pasar de una a otra. */}
        <Image
          key={foto.img}
          src={foto.img}
          alt={foto.alt}
          fill
          sizes="100vw"
          className="object-contain aparecer"
        />
      </figure>

      <figcaption className="text-center text-crema/70 text-sm px-5 pb-5 shrink-0">
        {foto.alt}
      </figcaption>

      {total > 1 && (
        <>
          <BotonPaso lado="izquierda" onClick={onAnterior} />
          <BotonPaso lado="derecha" onClick={onSiguiente} />
        </>
      )}
    </div>
  );
}

function BotonPaso({
  lado,
  onClick,
}: {
  lado: "izquierda" | "derecha";
  onClick: () => void;
}) {
  const izquierda = lado === "izquierda";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={izquierda ? "Foto anterior" : "Foto siguiente"}
      className={`cerrar absolute top-1/2 -translate-y-1/2 hover:rotate-0 ${
        izquierda ? "left-3" : "right-3"
      }`}
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
        <path
          d={izquierda ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </button>
  );
}

function Cruz() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
