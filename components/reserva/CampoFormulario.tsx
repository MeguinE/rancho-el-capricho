import type { ReactNode } from "react";

type Props = {
  /** Id del control, para enlazar la etiqueta y el mensaje de error. */
  id: string;
  etiqueta: string;
  error?: string;
  /** Texto de ayuda que se muestra cuando no hay error. */
  ayuda?: string;
  opcional?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Etiqueta, control y mensaje de error de un campo.
 *
 * Centralizar esto es lo que hace que todos los campos queden igual y, sobre
 * todo, que no se olvide enlazar el error con el control: el mensaje lleva el
 * id que el input referencia con `aria-describedby`, y se anuncia al aparecer.
 */
export default function CampoFormulario({
  id,
  etiqueta,
  error,
  ayuda,
  opcional = false,
  className = "",
  children,
}: Props) {
  return (
    <div className={className}>
      <label htmlFor={id} className="etiqueta-campo">
        {etiqueta}
        {opcional && (
          <span className="text-crema/35 normal-case tracking-normal ml-1.5">
            (opcional)
          </span>
        )}
      </label>

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-[#ffb3a3] text-sm mt-1.5 flex items-start gap-1.5"
        >
          <span aria-hidden="true">▲</span>
          {error}
        </p>
      ) : (
        ayuda && (
          <p id={`${id}-ayuda`} className="text-crema/40 text-xs mt-1.5">
            {ayuda}
          </p>
        )
      )}
    </div>
  );
}
