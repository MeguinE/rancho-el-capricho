import type { CSSProperties } from "react";
import Seccion from "@/components/Seccion";
import TituloSeccion from "@/components/TituloSeccion";
import Revelar from "@/components/anim/Revelar";
import Icono from "@/components/Icono";
import { servicios } from "@/lib/data";

/** Tipos de evento que cubre el rancho. */
export default function Servicios() {
  return (
    <Seccion id="servicios" fondo="noche">
      <TituloSeccion
        antetitulo="Lo que ofrecemos"
        titulo="Eventos & Servicios"
        className="mb-14"
      />

      <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {servicios.map((s, i) => (
          <Revelar como="li" key={s.titulo} className="h-full" umbral={0.1}>
            <article
              data-anim="subir"
              style={{ "--retardo": `${i * 110}ms` } as CSSProperties}
              className="grupo-tarjeta tarjeta tarjeta--foco h-full p-7 text-center"
            >
              {/* Número de fondo: da jerarquía sin añadir ruido */}
              <span
                aria-hidden="true"
                className="titulo-display texto-hueco absolute top-3 right-4 text-4xl select-none"
              >
                0{i + 1}
              </span>

              <span className="relative inline-flex items-center justify-center w-16 h-16 mb-5 text-atardecer">
                {/* Aro que gira al pasar el cursor, detrás del icono */}
                <span className="absolute inset-0 rounded-full border border-cuero-claro/50 bg-madera/60 transition-[transform,border-color] duration-700 ease-[var(--ease-salida)] [.grupo-tarjeta:hover_&]:rotate-[135deg] [.grupo-tarjeta:hover_&]:border-atardecer" />
                <Icono name={s.icono} className="relative w-8 h-8" />
              </span>

              <h3 className="titulo-display text-xl">{s.titulo}</h3>
              <p className="text-crema/70 text-sm leading-relaxed mt-2.5">
                {s.descripcion}
              </p>
            </article>
          </Revelar>
        ))}
      </ul>
    </Seccion>
  );
}
