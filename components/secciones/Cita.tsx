import Image from "next/image";
import type { CSSProperties } from "react";
import Revelar from "@/components/anim/Revelar";
import TextoRevelado from "@/components/anim/TextoRevelado";
import { fotos } from "@/lib/data";

/**
 * Pausa visual a media página: una frase grande sobre una foto a sangre.
 *
 * El fondo usa `next/image` con un zoom ligado al scroll en vez de
 * `background-attachment: fixed`. Así la imagen se sirve optimizada y con
 * srcset, y el efecto también funciona en iOS, donde el `fixed` se ignora.
 */
export default function Cita() {
  return (
    <section className="relative isolate overflow-hidden py-32 sm:py-44 px-5">
      <div className="absolute inset-0 -z-20 scrub-zoom">
        <Image
          src={fotos.cita}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-madera/82" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 vineta" />

      <Revelar className="relative mx-auto max-w-4xl text-center">
        <figure>
          <span
            data-anim="escala"
            className="titulo-display block text-5xl text-atardecer/70 leading-none"
            aria-hidden="true"
          >
            “
          </span>

          <blockquote>
            <TextoRevelado
              como="p"
              texto={
                "El caballo es el único compañero\nque convierte un momento en leyenda."
              }
              retardoBase={160}
              paso={48}
              className="titulo-display text-[clamp(1.6rem,4.4vw,3rem)] leading-[1.15] mt-3"
            />
          </blockquote>

          <figcaption
            data-anim="fundido"
            style={{ "--retardo": "760ms" } as CSSProperties}
            className="mt-9"
          >
            <span className="soga block max-w-[14rem] mx-auto" />
            <span className="sr-only">Dicho del rancho</span>
          </figcaption>
        </figure>
      </Revelar>
    </section>
  );
}
