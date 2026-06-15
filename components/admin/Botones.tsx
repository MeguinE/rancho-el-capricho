"use client";

import { useFormStatus } from "react-dom";

/* Botón de envío que se deshabilita y muestra "..." mientras procesa. */
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
      className={`inline-flex items-center justify-center gap-2 rounded-md font-semibold uppercase tracking-wide text-sm px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {pending ? pendingText : children}
    </button>
  );
}

/* Botón de borrado que pide confirmación antes de enviar el formulario. */
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
      className="inline-flex items-center gap-1.5 rounded-md border border-red-500/40 text-red-300 hover:bg-red-500/15 text-sm px-3 py-1.5 transition-colors disabled:opacity-50"
    >
      {pending ? "…" : children}
    </button>
  );
}
