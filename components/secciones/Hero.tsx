import Image from "next/image";
import type { CSSProperties } from "react";
import Polvo from "@/components/anim/Polvo";
import Revelar from "@/components/anim/Revelar";
import TextoRevelado from "@/components/anim/TextoRevelado";
import Contador from "@/components/anim/Contador";
import Icono from "@/components/Icono";
import { fotos, logros } from "@/lib/data";

/**
 * Primera pantalla del sitio: foto a sangre, título que se revela palabra por
 * palabra y las cifras que dan confianza antes de pedir nada.
 *
 * Las capas van de atrás hacia delante con `z-index` negativo sobre un
 * contexto aislado (`isolate`), de modo que el contenido queda siempre encima
 * sin tener que ir subiendo índices.
 */
export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative isolate min-h-[100svh] flex items-end sm:items-center overflow-hidden"
    >
      {/* Foto de fondo. Dos transformaciones encadenadas en elementos
          distintos: el padre se hunde con el scroll, el hijo hace zoom lento. */}
      <div className="absolute inset-0 -z-30 scrub-hero">
        <div className="absolute inset-0 ken-burns">
          <Image
            src={fotos.hero}
            alt="Caballo galopando al atardecer en el rancho"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_35%]"
          />
        </div>
      </div>

      {/* Oscurecido para que el texto se lea, con un resplandor cálido arriba */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-carbon/90 via-madera/40 to-madera" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-1/4 h-2/3 -z-20 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 70% 55%, rgba(230,181,102,0.3), transparent 70%)",
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-20 vineta" />

      <Polvo className="-z-10" />

      {/* Dos siluetas de cerros que se mueven a distinta velocidad */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-[-5%] h-40 -z-20 scrub-par bg-[#1b1510] opacity-70"
        style={
          {
            "--par": 5,
            clipPath:
              "polygon(0 72%, 14% 52%, 30% 66%, 48% 44%, 66% 62%, 84% 48%, 100% 64%, 100% 100%, 0 100%)",
          } as CSSProperties
        }
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-[-3%] h-28 -z-10 bg-madera"
        style={{
          clipPath:
            "polygon(0 60%, 12% 45%, 28% 58%, 45% 38%, 62% 55%, 80% 40%, 100% 58%, 100% 100%, 0 100%)",
        }}
      />

      <Revelar className="relative w-full px-5 pb-24 sm:pb-16 pt-32">
        <div className="mx-auto max-w-5xl text-center">
          <p
            className="placa mx-auto mb-7 text-crema/90 hero-entrada"
            style={{ "--retardo": "120ms" } as CSSProperties}
          >
            <span className="text-atardecer" aria-hidden="true">
              ★
            </span>
            Renta de caballos para eventos
          </p>

          <TextoRevelado
            como="h1"
            texto={"Rancho\nel Capricho"}
            retardoBase={260}
            paso={110}
            className="font-display palabras-fuego text-[clamp(3.2rem,12vw,8.5rem)] leading-[0.86] tracking-tight"
          />

          <p
            className="hero-entrada mx-auto mt-7 max-w-2xl text-crema/90 text-lg sm:text-2xl leading-relaxed"
            style={{ "--retardo": "620ms" } as CSSProperties}
          >
            Caballos majestuosos para que tu evento sea legendario. Bodas, XV
            años, cabalgatas y sesiones de fotos con auténtico sabor vaquero.
          </p>

          <div
            className="hero-entrada mt-9 flex flex-col sm:flex-row gap-4 justify-center"
            style={{ "--retardo": "800ms" } as CSSProperties}
          >
            <a href="#reservar" className="btn btn--fuego">
              <Icono name="herradura" className="w-5 h-5" />
              Reservar caballos
            </a>
            <a href="#caballos" className="btn btn--fantasma">
              Conoce a los caballos
            </a>
          </div>

          {/* Cifras en una barra de cristal: credibilidad antes de pedir datos */}
          <dl
            className="hero-entrada mx-auto mt-14 grid max-w-2xl grid-cols-3 divide-x divide-cuero/30 rounded-2xl border border-cuero/40 bg-carbon/45 backdrop-blur-md py-5"
            style={{ "--retardo": "980ms" } as CSSProperties}
          >
            {logros.map((l) => (
              <div key={l.etiqueta} className="px-3">
                <dd className="titulo-display text-3xl sm:text-4xl text-atardecer">
                  <Contador hasta={l.valor} prefijo="+" />
                </dd>
                <dt className="mt-1 text-[0.68rem] sm:text-xs uppercase tracking-[0.18em] text-crema/60">
                  {l.etiqueta}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </Revelar>

      <a
        href="#historia"
        aria-label="Bajar a la siguiente sección"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2 text-crema/50 hover:text-atardecer transition-colors"
      >
        <span className="text-[0.62rem] uppercase tracking-[0.3em]">
          Desliza
        </span>
        <span className="flotar" aria-hidden="true">
          ▼
        </span>
      </a>
    </section>
  );
}
