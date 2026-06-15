"use client";

import { useEffect, useRef, useState } from "react";

/* Número que cuenta hacia arriba cuando entra en pantalla. */
export default function Contador({
  hasta,
  prefijo = "",
  sufijo = "",
  duracion = 1600,
}: {
  hasta: number;
  prefijo?: string;
  sufijo?: string;
  duracion?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [valor, setValor] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();

        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        if (reduce) {
          setValor(hasta);
          return;
        }

        const inicio = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - inicio) / duracion, 1);
          const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
          setValor(Math.round(eased * hasta));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasta, duracion]);

  return (
    <span ref={ref}>
      {prefijo}
      {valor}
      {sufijo}
    </span>
  );
}
