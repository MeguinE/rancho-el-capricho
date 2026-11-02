import Image from "next/image";

/*
  Muestra una foto si "src" tiene valor; si no, muestra un marco placeholder
  elegante. Incluye un sutil zoom al pasar el cursor y un velo inferior
  opcional para que el texto encima se lea bien.
*/
export default function FotoPlaceholder({
  src,
  alt,
  etiqueta,
  className = "",
  sizes = "(max-width: 768px) 100vw, 33vw",
  velo = false,
  zoom = false,
  priority = false,
}: {
  src?: string;
  alt: string;
  etiqueta?: string;
  className?: string;
  sizes?: string;
  velo?: boolean;
  zoom?: boolean;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={`marco-foto group ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover transition-transform duration-700 ${
            zoom ? "group-hover:scale-110" : ""
          }`}
        />
        {velo && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1410] via-transparent to-transparent" />
        )}
      </div>
    );
  }

  return (
    <div
      className={`marco-foto flex flex-col items-center justify-center text-center p-6 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-12 h-12 mb-3 text-cuero-claro/80"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 21c-2-1.5-3-4-3-7a8 8 0 0 1 16 0c0 3-1 5.5-3 7" />
        <circle cx="7" cy="20" r="0.7" fill="currentColor" />
        <circle cx="17" cy="20" r="0.7" fill="currentColor" />
      </svg>
      <p className="font-slab text-crema/80 text-sm">
        {etiqueta ?? "Tu foto aquí"}
      </p>
      <p className="text-crema/40 text-xs mt-1">/public/img</p>
    </div>
  );
}
