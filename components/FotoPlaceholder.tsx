import Image from "next/image";

type Props = {
  /** Si viene vacío se dibuja el marco de relleno. */
  src?: string;
  alt: string;
  /** Texto del marco de relleno, para saber qué foto falta. */
  etiqueta?: string;
  className?: string;
  sizes?: string;
  /** Degradado inferior, para que el texto encima se lea. */
  velo?: boolean;
  /** Acercamiento suave al pasar el cursor. */
  zoom?: boolean;
  prioridad?: boolean;
};

/**
 * Foto con marco de cuero, o un marco de relleno elegante si todavía no hay
 * imagen.
 *
 * El relleno existe para que la página nunca se vea rota mientras el rancho
 * sube sus fotos. No menciona rutas ni nombres de archivo: eso es información
 * para quien monta el sitio, no para quien lo visita.
 *
 * Usa `fill`, así que el contenedor tiene que tener altura (por aspecto, por
 * rejilla o con `h-full`).
 */
export default function FotoPlaceholder({
  src,
  alt,
  etiqueta,
  className = "",
  sizes = "(max-width: 768px) 100vw, 33vw",
  velo = false,
  zoom = false,
  prioridad = false,
}: Props) {
  if (src) {
    return (
      <div className={`marco-foto group ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={prioridad}
          className={`object-cover transition-transform duration-[900ms] ease-[var(--ease-salida)] ${
            zoom ? "group-hover:scale-[1.09]" : ""
          }`}
        />
        {velo && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/25 to-transparent"
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={`marco-foto flex flex-col items-center justify-center text-center p-6 ${className}`}
    >
      <Herradura />
      <p className="font-slab text-crema/75 text-sm mt-3">
        {etiqueta ?? "Foto en camino"}
      </p>
    </div>
  );
}

function Herradura() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-11 h-11 text-cuero-claro/70"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 21c-2-1.5-3-4-3-7a8 8 0 0 1 16 0c0 3-1 5.5-3 7" />
      <circle cx="7" cy="20" r="0.7" fill="currentColor" />
      <circle cx="17" cy="20" r="0.7" fill="currentColor" />
    </svg>
  );
}
