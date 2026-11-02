"use client";

import { useCallback, useEffect, useRef } from "react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Grados máximos de inclinación en cada eje. */
  intensidad?: number;
  /** Cuánto se levanta la tarjeta al pasar el cursor, en píxeles. */
  elevacion?: number;
  como?: "div" | "article" | "li" | "figure";
};

/**
 * Inclina su contenido siguiendo al cursor y escribe la posición del ratón en
 * `--raton-x` / `--raton-y` para que el CSS pueda dibujar un reflejo.
 *
 * Decisiones de implementación:
 * - Solo actúa con punteros precisos (ratón o trackpad). En táctil estorba.
 * - Se desactiva si el usuario pidió reducir el movimiento.
 * - Escribe en el DOM dentro de `requestAnimationFrame`, así nunca hay más de
 *   una escritura por fotograma aunque el ratón dispare decenas de eventos.
 * - No usa estado de React: mover el ratón no debe provocar renders.
 */
export default function Tarjeta3D({
  children,
  className = "",
  intensidad = 6,
  elevacion = 8,
  como: Etiqueta = "div",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const activo = useRef(false);
  const fotograma = useRef<number | null>(null);

  useEffect(() => {
    const finos = window.matchMedia("(hover: hover) and (pointer: fine)");
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");

    const evaluar = () => {
      activo.current = finos.matches && !quieto.matches;
      if (!activo.current && ref.current) {
        ref.current.style.transform = "";
      }
    };

    evaluar();
    finos.addEventListener("change", evaluar);
    quieto.addEventListener("change", evaluar);

    return () => {
      finos.removeEventListener("change", evaluar);
      quieto.removeEventListener("change", evaluar);
      if (fotograma.current !== null) cancelAnimationFrame(fotograma.current);
    };
  }, []);

  const alMover = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el || !activo.current) return;

      const caja = el.getBoundingClientRect();
      const x = (e.clientX - caja.left) / caja.width; // 0 a 1
      const y = (e.clientY - caja.top) / caja.height;

      if (fotograma.current !== null) cancelAnimationFrame(fotograma.current);
      fotograma.current = requestAnimationFrame(() => {
        el.style.setProperty("--raton-x", `${x * 100}%`);
        el.style.setProperty("--raton-y", `${y * 100}%`);
        el.style.transform =
          `perspective(900px) ` +
          `rotateX(${(0.5 - y) * intensidad * 2}deg) ` +
          `rotateY(${(x - 0.5) * intensidad * 2}deg) ` +
          `translate3d(0, -${elevacion}px, 0)`;
      });
    },
    [intensidad, elevacion]
  );

  const alEntrar = useCallback(() => {
    // Mientras el cursor está encima acortamos la transición del transform
    // (lo hace el CSS con [data-inclinando]) para que el giro no vaya a rastras.
    if (activo.current && ref.current) {
      ref.current.dataset.inclinando = "si";
    }
  }, []);

  const alSalir = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (fotograma.current !== null) cancelAnimationFrame(fotograma.current);
    delete el.dataset.inclinando;
    el.style.transform = "";
    el.style.removeProperty("--raton-x");
    el.style.removeProperty("--raton-y");
  }, []);

  return (
    <Etiqueta
      ref={ref as React.Ref<never>}
      onPointerEnter={alEntrar}
      onPointerMove={alMover}
      onPointerLeave={alSalir}
      onPointerCancel={alSalir}
      className={className}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </Etiqueta>
  );
}
