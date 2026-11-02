import type { CSSProperties } from "react";
import Seccion from "@/components/Seccion";
import TituloSeccion from "@/components/TituloSeccion";
import Revelar from "@/components/anim/Revelar";
import { testimonios } from "@/lib/data";

/**
 * Opiniones de clientes.
 *
 * En móvil es una fila que se desliza con ajuste de posición; en escritorio
 * una rejilla de tres. Todo con CSS: el carrusel no necesita JavaScript, así
 * que funciona igual con el teclado, con lector de pantalla y sin hidratar.
 */
export default function Testimonios() {
  return (
    <Seccion id="testimonios">
      <TituloSeccion
        antetitulo="Lo que dicen de nosotros"
        titulo="Historias del rancho"
        className="mb-14"
      />

      <Revelar umbral={0.05}>
        <ul
          className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-5 px-5 pb-3 md:mx-0 md:px-0 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Opiniones de clientes"
        >
          {testimonios.map((t, i) => (
            <li
              key={t.autor}
              data-anim="subir"
              style={{ "--retardo": `${i * 130}ms` } as CSSProperties}
              className="snap-center shrink-0 w-[85%] sm:w-[55%] md:w-auto"
            >
              <figure className="grupo-tarjeta tarjeta tarjeta--foco h-full p-7 flex flex-col">
                <span
                  aria-hidden="true"
                  className="titulo-display text-5xl leading-none text-cuero/60 select-none"
                >
                  “
                </span>

                <blockquote className="text-crema/85 leading-relaxed italic flex-1 mt-1">
                  {t.texto}
                </blockquote>

                <figcaption className="mt-6 pt-5 border-t border-cuero/30 flex items-center justify-between gap-3">
                  <div>
                    <p className="titulo-display text-lg leading-tight">
                      {t.autor}
                    </p>
                    <p className="text-atardecer text-[0.64rem] uppercase tracking-[0.2em] mt-1">
                      {t.evento}
                    </p>
                  </div>
                  <p
                    className="text-atardecer text-sm shrink-0"
                    aria-label="5 de 5 estrellas"
                  >
                    <span aria-hidden="true">★★★★★</span>
                  </p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <p className="md:hidden text-center text-crema/40 text-xs uppercase tracking-[0.22em] mt-4">
          Desliza para ver más
        </p>
      </Revelar>
    </Seccion>
  );
}
