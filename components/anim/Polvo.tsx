"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

type Particula = {
  izq: number;
  tam: number;
  duracion: number;
  retardo: number;
  deriva: number;
};

type Props = {
  cantidad?: number;
  className?: string;
};

/**
 * Partículas de polvo dorado flotando: el aire del rancho a contraluz.
 *
 * Se generan en el cliente después de montar, nunca en el servidor: usan
 * `Math.random()` y renderizarlas en ambos lados provocaría un desajuste de
 * hidratación. Si el usuario pidió reducir el movimiento no se generan.
 */
export default function Polvo({ cantidad = 28, className = "" }: Props) {
  const [particulas, setParticulas] = useState<Particula[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setParticulas(
      Array.from({ length: cantidad }, () => ({
        izq: Math.random() * 100,
        tam: 2 + Math.random() * 4,
        duracion: 9 + Math.random() * 13,
        retardo: Math.random() * 14,
        deriva: -30 + Math.random() * 60,
      }))
    );
  }, [cantidad]);

  if (particulas.length === 0) return null;

  return (
    <div className={`polvo ${className}`} aria-hidden="true">
      {particulas.map((p, i) => (
        <i
          key={i}
          style={
            {
              left: `${p.izq}%`,
              width: `${p.tam}px`,
              height: `${p.tam}px`,
              animationDuration: `${p.duracion}s`,
              animationDelay: `${p.retardo}s`,
              "--deriva": `${p.deriva}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
