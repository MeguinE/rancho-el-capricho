"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Valor final al que debe llegar la cuenta. */
  hasta: number;
  prefijo?: string;
  sufijo?: string;
  /** Duración de la cuenta en milisegundos. */
  duracion?: number;
};

/** Suaviza el final de la cuenta para que frene en vez de cortarse en seco. */
const frenar = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Número que cuenta hacia arriba la primera vez que entra en pantalla.
 *
 * Reserva el ancho del valor final con una copia invisible, así el texto de
 * alrededor no se mueve mientras la cifra crece.
 */
export default function Contador({
  hasta,
  prefijo = "",
  sufijo = "",
  duracion = 1800,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [valor, setValor] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (quieto.matches || typeof IntersectionObserver === "undefined") {
      setValor(hasta);
      return;
    }

    let fotograma = 0;
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        obs.disconnect();

        const inicio = performance.now();
        const paso = (ahora: number) => {
          const t = Math.min((ahora - inicio) / duracion, 1);
          setValor(Math.round(frenar(t) * hasta));
          if (t < 1) fotograma = requestAnimationFrame(paso);
        };
        fotograma = requestAnimationFrame(paso);
      },
      { threshold: 0.4 }
    );

    obs.observe(el);
    return () => {
      obs.disconnect();
      if (fotograma) cancelAnimationFrame(fotograma);
    };
  }, [hasta, duracion]);

  return (
    <span ref={ref} className="relative inline-grid">
      {/* Fantasma que fija el ancho definitivo y evita saltos de maquetación */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {prefijo}
        {hasta}
        {sufijo}
      </span>
      <span className="col-start-1 row-start-1 tabular-nums">
        {prefijo}
        {valor}
        {sufijo}
      </span>
    </span>
  );
}
