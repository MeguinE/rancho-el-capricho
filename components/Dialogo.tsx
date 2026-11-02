"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type Props = {
  abierto: boolean;
  /** Se llama tanto al pulsar Escape como al hacer clic fuera del panel. */
  onCerrar: () => void;
  /** Descripción para lectores de pantalla. */
  titulo: string;
  children: ReactNode;
  /** `centro` para formularios, `completo` para menús y visores de foto. */
  variante?: "centro" | "completo";
  className?: string;
};

/**
 * Ventana modal construida sobre el elemento nativo `<dialog>`.
 *
 * Usar `showModal()` en vez de un div flotante nos da gratis y bien hecho:
 * atrapar el foco dentro del panel, cerrar con Escape, marcar el resto de la
 * página como inerte para los lectores de pantalla y la capa de fondo
 * (`::backdrop`). La animación de entrada y salida es CSS (`@starting-style` y
 * `transition-behavior: allow-discrete`), así que no hay temporizadores en JS
 * para esperar a que termine.
 */
export default function Dialogo({
  abierto,
  onCerrar,
  titulo,
  children,
  variante = "centro",
  className = "",
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  // Abre y cierra siguiendo la prop, sin perder la sincronía con el DOM.
  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;

    if (abierto && !dlg.open) dlg.showModal();
    if (!abierto && dlg.open) dlg.close();
  }, [abierto]);

  // El diálogo nativo no bloquea el scroll de la página; lo hacemos nosotros.
  useEffect(() => {
    if (!abierto) return;
    const html = document.documentElement;
    const previo = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previo;
    };
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      aria-label={titulo}
      className={`dialogo dialogo--${variante} ${className}`}
      // Se dispara con Escape y con `close()`: un solo camino de salida.
      onClose={onCerrar}
      onCancel={(e) => {
        e.preventDefault();
        onCerrar();
      }}
      // Clic en la capa de fondo: el evento llega al propio <dialog> porque el
      // panel interior ocupa solo una parte de él.
      onClick={(e) => {
        if (e.target === ref.current) onCerrar();
      }}
    >
      {children}
    </dialog>
  );
}
