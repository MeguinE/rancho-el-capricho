"use client";

import { useFormStatus } from "react-dom";

/**
 * Botón de envío que se bloquea mientras la Server Action está en marcha.
 *
 * `useFormStatus` lee el estado del <form> que lo contiene, así que el botón
 * no necesita que le pasen nada: basta con que esté dentro del formulario.
 */
export function BotonSubmit({
  children,
  className = "",
  pendingText = "Guardando…",
}: {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-semibold uppercase tracking-[0.08em] text-sm px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {pending ? pendingText : children}
    </button>
  );
}

/**
 * Botón de borrado que pide confirmación antes de enviar.
 *
 * Usa `confirm()` del navegador a propósito: para una acción irreversible en
 * un panel interno, una ventana que no se puede ignorar vale más que un diseño
 * bonito, y no añade estado ni dependencias.
 */
export function BotonEliminar({
  children = "Eliminar",
  mensaje = "¿Seguro que quieres eliminar esto? No se puede deshacer.",
}: {
  children?: React.ReactNode;
  mensaje?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm(mensaje)) e.preventDefault();
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-sangre text-[#ffb3a3] hover:bg-sangre/30 text-sm px-3 py-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "…" : children}
    </button>
  );
}
