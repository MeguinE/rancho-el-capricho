import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  id?: string;
  /** `noche` oscurece el bloque y le pone filos; alterna el ritmo visual. */
  fondo?: "ninguno" | "noche";
  ancho?: "estrecho" | "normal" | "amplio";
  /** Espaciado vertical. `suelto` para secciones con mucho peso visual. */
  aire?: "normal" | "suelto";
  className?: string;
};

const anchos = {
  estrecho: "max-w-3xl",
  normal: "max-w-6xl",
  amplio: "max-w-7xl",
} as const;

/**
 * Envoltura de sección: centra el contenido y mantiene el mismo ritmo de
 * espaciado y de fondos en toda la página.
 *
 * Existe para que las secciones no repitan la misma ristra de clases de
 * maquetación y para poder cambiar el ritmo del sitio desde un solo sitio.
 */
export default function Seccion({
  children,
  id,
  fondo = "ninguno",
  ancho = "normal",
  aire = "normal",
  className = "",
}: Props) {
  return (
    <section
      id={id}
      className={`relative px-5 ${
        aire === "suelto" ? "py-24 sm:py-36" : "py-20 sm:py-28"
      } ${
        fondo === "noche" ? "bg-noche/55 border-y border-cuero/25" : ""
      } ${className}`}
    >
      <div className={`mx-auto ${anchos[ancho]}`}>{children}</div>
    </section>
  );
}
