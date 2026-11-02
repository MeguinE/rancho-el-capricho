type Props = {
  items: string[];
  /** Segundos que tarda la cinta en dar una vuelta completa. */
  duracion?: number;
  /** Invierte el sentido de la marcha. */
  inversa?: boolean;
};

/**
 * Cinta de texto en movimiento continuo, como el letrero de una cantina.
 *
 * El bucle se ve sin costuras porque pintamos la lista dos veces y la pista se
 * desplaza exactamente su propio ancho. Las dos copias visibles están ocultas
 * para la tecnología de asistencia y el contenido real se expone una sola vez
 * en una lista fuera de pantalla: así nadie oye las frases repetidas.
 */
export default function Marquee({
  items,
  duracion = 34,
  inversa = false,
}: Props) {
  const pista = (
    <div className="cinta__via">
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
    <div className="relative border-y border-cuero/30 bg-carbon/60">
      <div
        className={`cinta py-5 ${inversa ? "cinta--inversa" : ""}`}
        style={{ "--cinta-dur": `${duracion}s` } as React.CSSProperties}
        aria-hidden="true"
      >
        {pista}
        {pista}
      </div>

      <ul className="sr-only">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
