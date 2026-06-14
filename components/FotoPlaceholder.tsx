import Image from "next/image";

/*
  Muestra una foto si "src" tiene valor; si no, muestra un marco placeholder
  con una nota para recordarte dónde poner la imagen.
*/
export default function FotoPlaceholder({
  src,
  alt,
  etiqueta,
  className = "",
}: {
  src?: string;
  alt: string;
  etiqueta?: string;
  className?: string;
}) {
  if (src) {
    return (
      <div className={`marco-foto ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`marco-foto flex flex-col items-center justify-center text-center p-6 ${className}`}
    >
      <span className="text-5xl mb-3 opacity-80">🐴</span>
      <p className="font-[family-name:var(--font-rustico)] text-crema/80 text-sm">
        {etiqueta ?? "Tu foto aquí"}
      </p>
      <p className="text-crema/40 text-xs mt-1">/public/img</p>
    </div>
  );
}
