"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Revelar from "@/components/anim/Revelar";
import Dialogo from "@/components/Dialogo";
import FotoPlaceholder from "@/components/FotoPlaceholder";
import VisorFoto from "@/components/galeria/VisorFoto";
import type { ItemGaleria } from "@/lib/contenido";

/** Reparte los huecos del mosaico según el patrón que trae cada foto. */
function claseDeHueco(span?: string) {
  if (span === "ancho") return "col-span-2";
  if (span === "alto") return "row-span-2";
  return "";
}

/**
 * Mosaico de fotos con visor a pantalla completa.
 *
 * Cada foto es un `<button>`, no un div con onClick: así se abre también con
 * el teclado y los lectores de pantalla la anuncian como lo que es.
 */
export default function MosaicoGaleria({ fotos }: { fotos: ItemGaleria[] }) {
  const [indice, setIndice] = useState<number | null>(null);
  const abierto = indice !== null;

  // Recordamos qué miniatura abrió el visor para devolverle el foco al cerrar.
  // Sin esto el foco vuelve al principio del documento y se pierde el sitio.
  const origen = useRef<HTMLButtonElement | null>(null);

  const mover = useCallback(
    (salto: number) => {
      setIndice((actual) =>
        actual === null
          ? actual
          : // Da la vuelta en los extremos en lugar de quedarse clavado.
            (actual + salto + fotos.length) % fotos.length
      );
    },
    [fotos.length]
  );

  const cerrar = useCallback(() => {
    setIndice(null);
    origen.current?.focus();
  }, []);

  // Flechas del teclado mientras el visor está abierto.
  useEffect(() => {
    if (!abierto) return;

    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") mover(1);
      if (e.key === "ArrowLeft") mover(-1);
    };

    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [abierto, mover]);

  const foto = indice === null ? null : fotos[indice];

  return (
    <>
      <Revelar umbral={0.05}>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[9rem] sm:auto-rows-[11rem]">
          {fotos.map((g, i) => (
            <li
              key={`${g.img}-${i}`}
              data-anim="escala"
              style={{ "--retardo": `${(i % 4) * 90}ms` } as CSSProperties}
              className={claseDeHueco(g.span)}
            >
              <button
                type="button"
                onClick={(e) => {
                  origen.current = e.currentTarget;
                  setIndice(i);
                }}
                aria-label={`Ampliar foto: ${g.alt}`}
                className="grupo-tarjeta group relative block h-full w-full rounded-xl overflow-hidden cursor-zoom-in transition-transform duration-500 ease-[var(--ease-salida)] hover:scale-[1.02]"
              >
                <FotoPlaceholder
                  src={g.img}
                  alt={g.alt}
                  etiqueta={`Evento ${i + 1}`}
                  className="h-full w-full rounded-xl border-0 brillo"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  zoom
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 grid place-items-center bg-carbon/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <span className="placa text-[0.6rem] text-crema">Ver</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Revelar>

      <Dialogo
        abierto={abierto}
        onCerrar={cerrar}
        titulo="Visor de fotos"
        variante="completo"
      >
        {foto && indice !== null && (
          <VisorFoto
            foto={foto}
            posicion={indice + 1}
            total={fotos.length}
            onAnterior={() => mover(-1)}
            onSiguiente={() => mover(1)}
            onCerrar={cerrar}
          />
        )}
      </Dialogo>
    </>
  );
}
