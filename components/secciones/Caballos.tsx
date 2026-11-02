import type { CSSProperties } from "react";
import Seccion from "@/components/Seccion";
import TituloSeccion from "@/components/TituloSeccion";
import Revelar from "@/components/anim/Revelar";
import Tarjeta3D from "@/components/anim/Tarjeta3D";
import FotoPlaceholder from "@/components/FotoPlaceholder";
import type { Caballo } from "@/lib/data";

/**
 * Fichas de los caballos del rancho.
 *
 * Cada ficha se inclina siguiendo al cursor y enciende un reflejo detrás. La
 * entrada escalonada va en un elemento envolvente, no en la ficha, porque la
 * inclinación escribe `transform` en línea y chocarían.
 */
export default function Caballos({ caballos }: { caballos: Caballo[] }) {
  return (
    <Seccion id="caballos">
      <TituloSeccion
        antetitulo="Las estrellas del rancho"
        titulo="Nuestros Caballos"
        descripcion="Cada uno con su carácter. Te ayudamos a elegir el que mejor encaje con tu evento."
        className="mb-14"
      />

      <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {caballos.map((c, i) => (
          <Revelar como="li" key={c.nombre} className="h-full" umbral={0.1}>
            <div
              data-anim="subir"
              style={{ "--retardo": `${i * 110}ms` } as CSSProperties}
              className="h-full"
            >
              <Tarjeta3D
                como="article"
                className="grupo-tarjeta tarjeta tarjeta--foco h-full overflow-hidden flex flex-col"
                intensidad={5}
                elevacion={10}
              >
                <div className="relative brillo">
                  <FotoPlaceholder
                    src={c.img}
                    alt={`${c.nombre}, caballo ${c.raza}`}
                    etiqueta={`Foto de ${c.nombre}`}
                    className="aspect-[3/4] border-0"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    zoom
                    velo
                  />

                  <span className="absolute top-3 left-3 placa text-[0.64rem] text-cuero-claro">
                    {c.temperamento}
                  </span>

                  <div className="absolute bottom-0 inset-x-0 p-4">
                    <h3 className="titulo-display text-2xl leading-none">
                      {c.nombre}
                    </h3>
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-atardecer mt-1.5">
                      {c.raza}
                    </p>
                  </div>
                </div>

                <p className="text-crema/70 text-sm leading-relaxed p-4 flex-1">
                  {c.descripcion}
                </p>
              </Tarjeta3D>
            </div>
          </Revelar>
        ))}
      </ul>
    </Seccion>
  );
}
