import Image from "next/image";
import Navbar from "@/components/Navbar";
import FotoPlaceholder from "@/components/FotoPlaceholder";
import FormReserva from "@/components/FormReserva";
import Reveal from "@/components/Reveal";
import Icono from "@/components/Icono";
import Marquee from "@/components/Marquee";
import Contador from "@/components/Contador";
import Polvo from "@/components/Polvo";
import {
  servicios,
  pasos,
  testimonios,
  contacto,
  fotos,
  cintaItems,
} from "@/lib/data";
import {
  obtenerCaballos,
  obtenerGaleria,
  obtenerLogo,
} from "@/lib/contenido";

export default async function Home() {
  const [caballos, galeria, logoSubido] = await Promise.all([
    obtenerCaballos(),
    obtenerGaleria(),
    obtenerLogo(),
  ]);
  // Usa el logo subido desde /admin; si no hay, el archivo /public/logo.png
  const logoUrl = logoSubido ?? "/logo.png";

  return (
    <>
      <Navbar logoUrl={logoUrl} />

      {/* ====================== HERO ====================== */}
      <section
        id="inicio"
        className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      >
        {/* Foto de fondo con zoom lento (Ken Burns). Reemplázala poniendo tu
            imagen en /public/img y cambiando "fotos.hero" en lib/data.ts */}
        <div className="absolute inset-0 ken-burns">
          <Image
            src={fotos.hero}
            alt="Caballo galopando en el rancho"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {/* Capas de oscurecido para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1410]/85 via-[#1a1410]/45 to-[#1a1410]" />
        <div className="absolute inset-0 vineta" />

        {/* Polvo dorado flotando */}
        <Polvo />

        {/* Silueta de cerros al pie */}
        <div
          className="absolute bottom-0 inset-x-0 h-32 bg-[#1a1410] z-[6]"
          style={{
            clipPath:
              "polygon(0 60%, 12% 45%, 28% 58%, 45% 38%, 62% 55%, 80% 40%, 100% 58%, 100% 100%, 0 100%)",
          }}
        />

        <div className="relative z-10 text-center px-5 max-w-5xl">
          <div className="placa mx-auto mb-7 hero-in" style={{ animationDelay: "0.1s" }}>
            <span className="text-atardecer">★</span>
            <span className="font-[family-name:var(--font-rustico)] text-crema/90 tracking-[0.25em] uppercase text-xs">
              Renta de caballos para eventos
            </span>
          </div>
          <h1
            className="hero-in font-[family-name:var(--font-display)] text-7xl sm:text-8xl lg:text-9xl leading-[0.88] texto-fuego"
            style={{ animationDelay: "0.25s" }}
          >
            Rancho<br />el Capricho
          </h1>
          <p
            className="hero-in mt-7 text-crema text-lg sm:text-2xl max-w-2xl mx-auto leading-relaxed"
            style={{ animationDelay: "0.5s" }}
          >
            Caballos majestuosos para que tu evento sea legendario. Bodas, XV
            años, cabalgatas y sesiones de fotos con auténtico sabor vaquero.
          </p>
          <div
            className="hero-in mt-9 flex flex-col sm:flex-row gap-4 justify-center"
            style={{ animationDelay: "0.75s" }}
          >
            <a href="#reservar" className="btn-rancho">
              Reservar caballos
            </a>
            <a href="#caballos" className="btn-rancho btn-fantasma">
              Conoce a los caballos
            </a>
          </div>
        </div>

        <a
          href="#historia"
          aria-label="Bajar"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-crema/60 text-sm animate-bounce z-10"
        >
          ▼
        </a>
      </section>

      {/* ====================== CINTA EN MOVIMIENTO ====================== */}
      <Marquee items={cintaItems} />

      {/* ====================== SOBRE EL RANCHO ====================== */}
      <section id="historia" className="py-20 sm:py-28 px-5">
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <span className="kicker kicker-izq mb-3">Nuestra historia</span>
            <h2 className="titulo-display text-4xl sm:text-5xl mt-3 mb-6">
              Tradición vaquera, momentos inolvidables
            </h2>
            <p className="text-crema/85 text-lg leading-relaxed mb-4">
              En{" "}
              <strong className="text-cuero-claro">Rancho el Capricho</strong>{" "}
              criamos y cuidamos caballos con cariño para llevar magia a tus
              celebraciones. Cada animal está entrenado para ser dócil, seguro y
              espectacular ante la cámara.
            </p>
            <p className="text-crema/70 leading-relaxed">
              Más que una renta, ofrecemos una experiencia: el aroma del campo,
              el galope al atardecer y recuerdos que durarán toda la vida.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              {[
                { n: 10, l: "Años de experiencia" },
                { n: 15, l: "Caballos entrenados" },
                { n: 200, l: "Eventos realizados" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="bg-[#0f0b08]/50 border border-cuero/40 rounded-lg p-4"
                >
                  <div className="titulo-display text-3xl text-atardecer">
                    <Contador hasta={s.n} prefijo="+" />
                  </div>
                  <div className="text-crema/60 text-xs uppercase tracking-wider mt-1">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={150}>
            <FotoPlaceholder
              src={fotos.historia}
              alt="El rancho"
              etiqueta="Foto del rancho / panorámica"
              className="aspect-[4/5] rounded-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
              zoom
            />
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5">
        <div className="soga" />
      </div>

      {/* ====================== CABALLOS ====================== */}
      <section id="caballos" className="py-20 sm:py-28 px-5">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center mb-14">
            <span className="kicker mb-3">Las estrellas del rancho</span>
            <h2 className="titulo-display text-4xl sm:text-5xl mt-3">
              Nuestros Caballos
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {caballos.map((c, i) => (
              <Reveal key={c.nombre} delay={i * 100}>
                <article className="card-rancho overflow-hidden h-full">
                  <div className="relative">
                    <FotoPlaceholder
                      src={c.img}
                      alt={c.nombre}
                      etiqueta={`Foto de ${c.nombre}`}
                      className="aspect-[3/4]"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      zoom
                      velo
                    />
                    <span className="absolute top-3 left-3 placa text-[11px] uppercase tracking-wider text-cuero-claro">
                      {c.temperamento}
                    </span>
                    <div className="absolute bottom-0 inset-x-0 p-4">
                      <h3 className="titulo-display text-2xl leading-none">
                        {c.nombre}
                      </h3>
                      <span className="text-xs uppercase tracking-widest text-atardecer">
                        {c.raza}
                      </span>
                    </div>
                  </div>
                  <p className="text-crema/70 text-sm p-4 leading-relaxed">
                    {c.descripcion}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== FRASE CON PARALLAX ====================== */}
      <section
        className="relative parallax py-32 sm:py-44 px-5"
        style={{ backgroundImage: `url(${fotos.cita})` }}
      >
        <div className="absolute inset-0 bg-[#1a1410]/80" />
        <div className="absolute inset-0 vineta" />
        <Reveal className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="text-atardecer text-4xl">“</span>
          <p className="titulo-display text-3xl sm:text-5xl leading-tight mt-2">
            El caballo es el único compañero que convierte
            <span className="texto-fuego"> un momento en leyenda.</span>
          </p>
          <div className="soga max-w-xs mx-auto mt-8" />
        </Reveal>
      </section>

      {/* ====================== SERVICIOS / EVENTOS ====================== */}
      <section
        id="servicios"
        className="py-20 sm:py-28 px-5 bg-[#0f0b08]/40 border-y border-cuero/30"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center mb-14">
            <span className="kicker mb-3">Lo que ofrecemos</span>
            <h2 className="titulo-display text-4xl sm:text-5xl mt-3">
              Eventos & Servicios
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {servicios.map((s, i) => (
              <Reveal key={s.titulo} delay={i * 100}>
                <div className="card-rancho text-center p-7 h-full">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-cuero-claro/50 bg-[#1a1410]/60 text-atardecer mb-5">
                    <Icono name={s.icono} />
                  </div>
                  <h3 className="titulo-display text-xl mb-2">{s.titulo}</h3>
                  <p className="text-crema/70 text-sm leading-relaxed">
                    {s.descripcion}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== CÓMO FUNCIONA ====================== */}
      <section className="py-20 sm:py-28 px-5">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center mb-14">
            <span className="kicker mb-3">Así de fácil</span>
            <h2 className="titulo-display text-4xl sm:text-5xl mt-3">
              Cómo funciona
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {pasos.map((p, i) => (
              <Reveal key={p.n} delay={i * 120}>
                <div className="text-center px-4">
                  <div className="titulo-display text-6xl text-cuero/70 mb-3">
                    {p.n}
                  </div>
                  <h3 className="titulo-display text-2xl mb-3">{p.titulo}</h3>
                  <p className="text-crema/70 leading-relaxed">
                    {p.descripcion}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== GALERÍA ====================== */}
      <section
        id="galeria"
        className="py-20 sm:py-28 px-5 bg-[#0f0b08]/40 border-y border-cuero/30"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center mb-14">
            <span className="kicker mb-3">Momentos en el rancho</span>
            <h2 className="titulo-display text-4xl sm:text-5xl mt-3">Galería</h2>
            <p className="text-crema/60 mt-3 max-w-xl mx-auto">
              Aquí van tus mejores fotos de eventos. Sustitúyelas poniendo
              imágenes en{" "}
              <code className="text-cuero-claro">/public/img</code> y editando{" "}
              <code className="text-cuero-claro">lib/data.ts</code>.
            </p>
          </Reveal>

          {/* Mosaico tipo galería */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px]">
            {galeria.map((g, i) => (
              <Reveal
                key={i}
                delay={(i % 4) * 80}
                className={`${
                  g.span === "ancho"
                    ? "col-span-2"
                    : g.span === "alto"
                    ? "row-span-2"
                    : ""
                }`}
              >
                <FotoPlaceholder
                  src={g.img}
                  alt={g.alt}
                  etiqueta={`Evento ${i + 1}`}
                  className="rounded-lg h-full w-full"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  zoom
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== TESTIMONIOS ====================== */}
      <section className="py-20 sm:py-28 px-5">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center mb-14">
            <span className="kicker mb-3">Lo que dicen de nosotros</span>
            <h2 className="titulo-display text-4xl sm:text-5xl mt-3">
              Historias del rancho
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-7">
            {testimonios.map((t, i) => (
              <Reveal key={t.autor} delay={i * 120}>
                <figure className="card-rancho p-7 h-full flex flex-col">
                  <div className="text-atardecer text-lg mb-3">★★★★★</div>
                  <blockquote className="text-crema/85 leading-relaxed italic flex-1">
                    “{t.texto}”
                  </blockquote>
                  <figcaption className="mt-5 pt-4 border-t border-cuero/30">
                    <div className="titulo-display text-lg">{t.autor}</div>
                    <div className="text-atardecer text-xs uppercase tracking-widest">
                      {t.evento}
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== RESERVAR ====================== */}
      <section
        id="reservar"
        className="py-20 sm:py-28 px-5 bg-[#0f0b08]/40 border-y border-cuero/30"
      >
        <div className="mx-auto max-w-3xl">
          <Reveal className="text-center mb-10">
            <span className="kicker mb-3">¿Listo para tu evento?</span>
            <h2 className="titulo-display text-4xl sm:text-5xl mt-3">
              Reserva tus Caballos
            </h2>
            <p className="text-crema/70 mt-3">
              Déjanos tus datos y te contactamos para crear una experiencia a tu
              medida.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="bg-[#1a1410]/70 border-2 border-cuero rounded-xl p-6 sm:p-9 shadow-2xl">
              <FormReserva />
            </div>

            <div className="text-center mt-8 text-crema/70">
              <p>O escríbenos directo:</p>
              <div className="flex flex-wrap gap-4 justify-center mt-3">
                <a
                  href={`https://wa.me/${contacto.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-rancho btn-fantasma"
                >
                  WhatsApp
                </a>
                <a
                  href={`tel:${contacto.telefono}`}
                  className="btn-rancho btn-fantasma"
                >
                  {contacto.telefono}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== FOOTER ====================== */}
      <footer className="bg-[#0f0b08] border-t border-cuero/40 py-12 px-5">
        <div className="mx-auto max-w-6xl grid sm:grid-cols-3 gap-8">
          <div>
            <h3 className="titulo-display text-2xl mb-3">Rancho el Capricho</h3>
            <p className="text-crema/60 text-sm leading-relaxed">
              Caballos para eventos sociales. Tradición, nobleza y momentos
              inolvidables.
            </p>
          </div>
          <div>
            <h4 className="uppercase tracking-wider text-atardecer text-sm mb-3">
              Contacto
            </h4>
            <ul className="text-crema/70 text-sm space-y-2">
              <li>📍 {contacto.ubicacion}</li>
              <li>📞 {contacto.telefono}</li>
              <li>✉️ {contacto.email}</li>
            </ul>
          </div>
          <div>
            <h4 className="uppercase tracking-wider text-atardecer text-sm mb-3">
              Síguenos
            </h4>
            <div className="flex gap-4">
              <a
                href={contacto.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-crema/70 hover:text-atardecer"
              >
                Instagram
              </a>
              <a
                href={contacto.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-crema/70 hover:text-atardecer"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-6xl mt-10 pt-6 border-t border-cuero/20 text-center text-crema/40 text-xs">
          © {new Date().getFullYear()} Rancho el Capricho. Hecho con 🤠 en el
          campo.
        </div>
      </footer>
    </>
  );
}
