import type { CSSProperties } from "react";
import Seccion from "@/components/Seccion";
import TituloSeccion from "@/components/TituloSeccion";
import Revelar from "@/components/anim/Revelar";
import { pasos } from "@/lib/data";

/**
 * Los tres pasos para reservar.
 *
 * La línea que une los pasos se dibuja a medida que la sección entra en
 * pantalla, con `animation-timeline`. Donde el navegador no lo soporte, la
 * línea aparece dibujada del todo, que es el estado correcto por defecto.
 */
export default function Pasos() {
  return (
    <Seccion>
      <TituloSeccion
        antetitulo="Así de fácil"
        titulo="Cómo funciona"
        className="mb-16"
      />

      <Revelar como="div" className="relative" umbral={0.05}>
        {/* Línea de unión: horizontal en escritorio, vertical en móvil */}
        <span
          aria-hidden="true"
          className="hidden md:block absolute top-7 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-transparent via-cuero-claro/60 to-transparent scrub-linea-x"
        />
        <span
          aria-hidden="true"
          className="md:hidden absolute top-7 bottom-10 left-7 w-px bg-gradient-to-b from-cuero-claro/60 via-cuero-claro/40 to-transparent scrub-linea-y"
        />

        <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
          {pasos.map((p, i) => (
            <li
              key={p.n}
              data-anim="subir"
              style={{ "--retardo": `${i * 150}ms` } as CSSProperties}
              className="relative flex gap-6 md:flex-col md:items-center md:text-center"
            >
              <span
                aria-hidden="true"
                className="shrink-0 grid place-items-center w-14 h-14 rounded-full border border-cuero-claro/60 bg-madera text-atardecer titulo-display text-xl"
              >
                {p.n}
              </span>

              <div className="md:mt-6">
                <h3 className="titulo-display text-2xl">{p.titulo}</h3>
                <p className="text-crema/70 leading-relaxed mt-2.5 max-w-sm md:mx-auto">
                  {p.descripcion}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Revelar>
    </Seccion>
  );
}
