/* Cinta de texto en movimiento continuo (estilo letrero western). */
export default function Marquee({ items }: { items: string[] }) {
  const fila = (
    <div className="cinta__via" aria-hidden="true">
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-10">
          <span className="titulo-display text-2xl sm:text-3xl text-cuero-claro/90 whitespace-nowrap">
            {t}
          </span>
          <span className="text-atardecer text-xl">★</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="cinta py-5 border-y border-cuero/30 bg-[#0f0b08]/60">
      {fila}
      {fila}
    </div>
  );
}
