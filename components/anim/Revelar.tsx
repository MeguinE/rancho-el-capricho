"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

export type Animacion =
  | "subir"
  | "bajar"
  | "izq"
  | "der"
  | "escala"
  | "difuminar"
  | "cortina"
  | "fundido";

type Etiqueta =
  | "div"
  | "section"
  | "article"
  | "header"
  | "footer"
  | "figure"
  | "li"
  | "span";

type Props = {
  children: ReactNode;
  /**
   * Animación del propio contenedor. Si se omite, el contenedor no se anima y
   * solo actúa como disparador de los descendientes que lleven `data-anim`.
   */
  anim?: Animacion;
  /** Espera antes de arrancar, en milisegundos. Útil para escalonar listas. */
  retardo?: number;
  /** Duración de la animación en milisegundos. */
  duracion?: number;
  /** Porción del elemento que debe verse para disparar (0 a 1). */
  umbral?: number;
  /** `rootMargin` del observador: adelanta o retrasa el disparo. */
  margen?: string;
  /** Si es false, vuelve a animar cada vez que entra en pantalla. */
  unaVez?: boolean;
  className?: string;
  como?: Etiqueta;
  id?: string;
};

/**
 * Dispara animaciones de entrada cuando el bloque aparece en pantalla.
 *
 * Marca su contenedor con `data-ver="si"` y deja que el CSS haga el trabajo:
 * no escucha el evento `scroll`, usa un IntersectionObserver que se desconecta
 * en cuanto termina. Las variantes y el respeto a `prefers-reduced-motion`
 * están definidos en `globals.css`.
 *
 * @example
 * <Revelar anim="difuminar" retardo={120}>
 *   <h2>Nuestros caballos</h2>
 *   <p data-anim="izq" style={{ "--retardo": "200ms" }}>Entra desde la izquierda</p>
 * </Revelar>
 */
export default function Revelar({
  children,
  anim,
  retardo = 0,
  duracion,
  umbral = 0.15,
  margen = "0px 0px -8% 0px",
  unaVez = true,
  className = "",
  como: Etiqueta = "div",
  id,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Sin soporte del observador, mostramos el contenido sin animar.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          if (unaVez) obs.disconnect();
        } else if (!unaVez) {
          setVisible(false);
        }
      },
      { threshold: umbral, rootMargin: margen }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [umbral, margen, unaVez]);

  const estilo = {
    "--retardo": `${retardo}ms`,
    ...(duracion ? { "--dur": `${duracion}ms` } : null),
  } as CSSProperties;

  return (
    <Etiqueta
      ref={ref as React.Ref<never>}
      id={id}
      data-ver={visible ? "si" : "no"}
      data-anim={anim}
      className={className}
      style={estilo}
    >
      {children}
    </Etiqueta>
  );
}
