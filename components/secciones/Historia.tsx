import type { CSSProperties } from "react";
import Seccion from "@/components/Seccion";
import Revelar from "@/components/anim/Revelar";
import TextoRevelado from "@/components/anim/TextoRevelado";
import Contador from "@/components/anim/Contador";
import FotoPlaceholder from "@/components/FotoPlaceholder";
import { fotos, logros, rancho } from "@/lib/data";

/**
 * Quiénes somos: texto a la izquierda, composición de dos fotos a la derecha.
 *
 * Las fotos no están simplemente apiladas: la pequeña se mueve a distinta
 * velocidad que la grande al hacer scroll, lo que da profundidad sin que haya
 * que mover nada desde JavaScript.
 */
export default function Historia() {
  return (
    <Seccion id="historia" className="luz-atardecer overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* ── Columna de texto ── */}
        <Revelar>
          <p data-anim="fundido" className="antetitulo antetitulo--izq">
            Nuestra historia
          </p>

          <TextoRevelado
            como="h2"
            texto={"Tradición vaquera,\nmomentos inolvidables"}
            retardoBase={120}
            paso={55}
            className="titulo-display text-[clamp(2.1rem,5vw,3.4rem)] leading-[1.05] mt-4"
          />

          <p
            data-anim="subir"
            style={{ "--retardo": "320ms" } as CSSProperties}
            className="text-crema/85 text-lg leading-relaxed mt-6"
          >
            En <strong className="text-cuero-claro">{rancho.nombre}</strong>{" "}
            criamos y cuidamos caballos con cariño para llevar magia a tus
            celebraciones. Cada animal está entrenado para ser dócil, seguro y
            espectacular ante la cámara.
          </p>

          <p
            data-anim="subir"
            style={{ "--retardo": "420ms" } as CSSProperties}
            className="text-crema/70 leading-relaxed mt-4"
          >
            Más que una renta, ofrecemos una experiencia: el aroma del campo, el
            galope al atardecer y recuerdos que durarán toda la vida.
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-4">
            {logros.map((l, i) => (
              <div
                key={l.etiqueta}
                data-anim="escala"
                style={
                  { "--retardo": `${520 + i * 110}ms` } as CSSProperties
                }
                className="tarjeta p-4 text-center"
              >
                <dd className="titulo-display text-3xl text-atardecer">
                  <Contador hasta={l.valor} prefijo="+" />
                </dd>
                <dt className="text-crema/60 text-[0.68rem] uppercase tracking-[0.14em] mt-1.5">
                  {l.etiqueta}
                </dt>
              </div>
            ))}
          </dl>
        </Revelar>

        {/* ── Composición de fotos ── */}
        <Revelar className="relative" umbral={0.1}>
          {/* La entrada y el parallax van en elementos distintos a propósito:
              ambos animan `transform` y en el mismo elemento se pisarían. */}
          <div data-anim="escala">
            <div className="scrub-par" style={{ "--par": 4 } as CSSProperties}>
              <FotoPlaceholder
                src={fotos.historia}
                alt="Panorámica del rancho al atardecer"
                etiqueta="Foto del rancho / panorámica"
                className="aspect-[4/5] rounded-2xl"
                sizes="(max-width: 1024px) 100vw, 46vw"
                zoom
              />
            </div>
          </div>

          {/* Foto montada, con parallax contrario para que se separe del fondo */}
          <div
            data-anim="der"
            style={{ "--retardo": "260ms" } as CSSProperties}
            className="absolute -bottom-8 -left-4 sm:left-[-8%] w-2/5 max-w-[14rem] hidden sm:block"
          >
            <div className="scrub-par" style={{ "--par": -7 } as CSSProperties}>
              <FotoPlaceholder
                src={fotos.detalle}
                alt="Caballos pastando en el rancho"
                etiqueta="Detalle"
                className="aspect-square rounded-xl"
                sizes="(max-width: 1024px) 40vw, 16vw"
                zoom
              />
            </div>
          </div>

          {/* Sello girado, como una calcomanía pegada sobre la foto */}
          <div
            data-anim="escala"
            style={{ "--retardo": "420ms" } as CSSProperties}
            className="absolute -top-5 -right-3 sm:right-[-6%] rotate-[9deg]"
          >
            <p className="placa bg-madera border-cuero-claro/70 flex-col gap-0 px-5 py-3 text-center">
              <span className="titulo-display text-2xl leading-none text-atardecer tracking-normal">
                {rancho.desde}
              </span>
              <span className="text-[0.6rem] text-crema/70 tracking-[0.22em] mt-1">
                Desde entonces
              </span>
            </p>
          </div>
        </Revelar>
      </div>
    </Seccion>
  );
}
