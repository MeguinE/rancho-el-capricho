import type { CSSProperties } from "react";

type Props = {
  /** Texto a revelar. Un salto de línea (`\n`) fuerza un corte de renglón. */
  texto: string;
  /** Etiqueta a renderizar. */
  como?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  /** Espera inicial en milisegundos. */
  retardoBase?: number;
  /** Incremento de espera entre palabra y palabra. */
  paso?: number;
};

/**
 * Revela un texto palabra por palabra, como si subiera desde debajo de una
 * línea invisible.
 *
 * No lleva JavaScript de cliente: solo pinta el marcado. La animación la
 * dispara el `<Revelar>` que lo envuelve al marcar `data-ver="si"`.
 *
 * @example
 * <Revelar>
 *   <TextoRevelado como="h2" texto={"Tradición vaquera,\nmomentos inolvidables"} />
 * </Revelar>
 */
export default function TextoRevelado({
  texto,
  como: Etiqueta = "span",
  className = "",
  retardoBase = 0,
  paso = 55,
}: Props) {
  const renglones = texto.split("\n");
  let indice = 0;

  return (
    <Etiqueta className={className}>
      {renglones.map((renglon, r) => (
        <span key={r} className="block">
          {renglon
            .split(" ")
            .filter(Boolean)
            .map((palabra) => {
              const retardo = retardoBase + indice * paso;
              indice += 1;
              return (
                // El espacio va fuera de `.palabra` para que no se recorte con
                // la máscara ni se anime por separado.
                <span key={`${r}-${indice}`}>
                  <span className="palabra">
                    <span
                      style={{ "--retardo": `${retardo}ms` } as CSSProperties}
                    >
                      {palabra}
                    </span>
                  </span>{" "}
                </span>
              );
            })}
        </span>
      ))}
    </Etiqueta>
  );
}
