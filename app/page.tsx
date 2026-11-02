import Navbar from "@/components/Navbar";
import FotoPlaceholder from "@/components/FotoPlaceholder";
import FormReserva from "@/components/FormReserva";
import Revelar from "@/components/anim/Revelar";
import Icono from "@/components/Icono";
import Marquee from "@/components/Marquee";
import Hero from "@/components/secciones/Hero";
import Historia from "@/components/secciones/Historia";
import Cita from "@/components/secciones/Cita";
import {
  servicios,
  pasos,
  testimonios,
  contacto,
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

      <main id="contenido">
        <Hero />

        {/* ====================== CINTA EN MOVIMIENTO ====================== */}
        <Marquee items={cintaItems} />

        <Historia />

        {/* ====================== CABALLOS ====================== */}
        <section id="caballos" className="py-20 sm:py-28 px-5">
          <div className="mx-auto max-w-6xl">
            <Revelar anim="subir" className="text-center mb-14">
              <span className="antetitulo mb-3">Las estrellas del rancho</span>
              <h2 className="titulo-display text-4xl sm:text-5xl mt-3">
                Nuestros Caballos
              </h2>
            </Revelar>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {caballos.map((c, i) => (
                <Revelar anim="subir" key={c.nombre} retardo={i * 100}>
                  <article className="tarjeta overflow-hidden h-full">
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
                      <span className="absolute top-3 left-3 placa text-[11px] text-cuero-claro">
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
                </Revelar>
              ))}
            </div>
          </div>
        </section>

        <Cita />

        {/* ====================== SERVICIOS / EVENTOS ====================== */}
        <section
          id="servicios"
          className="py-20 sm:py-28 px-5 bg-noche/50 border-y border-cuero/30"
        >
          <div className="mx-auto max-w-6xl">
            <Revelar anim="subir" className="text-center mb-14">
              <span className="antetitulo mb-3">Lo que ofrecemos</span>
              <h2 className="titulo-display text-4xl sm:text-5xl mt-3">
                Eventos & Servicios
              </h2>
            </Revelar>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {servicios.map((s, i) => (
                <Revelar anim="subir" key={s.titulo} retardo={i * 100}>
                  <div className="tarjeta text-center p-7 h-full">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-cuero-claro/50 bg-madera/60 text-atardecer mb-5">
                      <Icono name={s.icono} />
                    </div>
                    <h3 className="titulo-display text-xl mb-2">{s.titulo}</h3>
                    <p className="text-crema/70 text-sm leading-relaxed">
                      {s.descripcion}
                    </p>
                  </div>
                </Revelar>
              ))}
            </div>
          </div>
        </section>

        {/* ====================== CÓMO FUNCIONA ====================== */}
        <section className="py-20 sm:py-28 px-5">
          <div className="mx-auto max-w-6xl">
            <Revelar anim="subir" className="text-center mb-14">
              <span className="antetitulo mb-3">Así de fácil</span>
              <h2 className="titulo-display text-4xl sm:text-5xl mt-3">
                Cómo funciona
              </h2>
            </Revelar>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {pasos.map((p, i) => (
                <Revelar anim="subir" key={p.n} retardo={i * 120}>
                  <div className="text-center px-4">
                    <div className="titulo-display text-6xl text-cuero/70 mb-3">
                      {p.n}
                    </div>
                    <h3 className="titulo-display text-2xl mb-3">{p.titulo}</h3>
                    <p className="text-crema/70 leading-relaxed">
                      {p.descripcion}
                    </p>
                  </div>
                </Revelar>
              ))}
            </div>
          </div>
        </section>

        {/* ====================== GALERÍA ====================== */}
        <section
          id="galeria"
          className="py-20 sm:py-28 px-5 bg-noche/50 border-y border-cuero/30"
        >
          <div className="mx-auto max-w-6xl">
            <Revelar anim="subir" className="text-center mb-14">
              <span className="antetitulo mb-3">Momentos en el rancho</span>
              <h2 className="titulo-display text-4xl sm:text-5xl mt-3">
                Galería
              </h2>
            </Revelar>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px]">
              {galeria.map((g, i) => (
                <Revelar
                  anim="subir"
                  key={i}
                  retardo={(i % 4) * 80}
                  className={
                    g.span === "ancho"
                      ? "col-span-2"
                      : g.span === "alto"
                      ? "row-span-2"
                      : ""
                  }
                >
                  <FotoPlaceholder
                    src={g.img}
                    alt={g.alt}
                    etiqueta={`Evento ${i + 1}`}
                    className="rounded-lg h-full w-full"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    zoom
                  />
                </Revelar>
              ))}
            </div>
          </div>
        </section>

        {/* ====================== TESTIMONIOS ====================== */}
        <section id="testimonios" className="py-20 sm:py-28 px-5">
          <div className="mx-auto max-w-6xl">
            <Revelar anim="subir" className="text-center mb-14">
              <span className="antetitulo mb-3">Lo que dicen de nosotros</span>
              <h2 className="titulo-display text-4xl sm:text-5xl mt-3">
                Historias del rancho
              </h2>
            </Revelar>

            <div className="grid md:grid-cols-3 gap-7">
              {testimonios.map((t, i) => (
                <Revelar anim="subir" key={t.autor} retardo={i * 120}>
                  <figure className="tarjeta p-7 h-full flex flex-col">
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
                </Revelar>
              ))}
            </div>
          </div>
        </section>

        {/* ====================== RESERVAR ====================== */}
        <section
          id="reservar"
          className="py-20 sm:py-28 px-5 bg-noche/50 border-y border-cuero/30"
        >
          <div className="mx-auto max-w-3xl">
            <Revelar anim="subir" className="text-center mb-10">
              <span className="antetitulo mb-3">¿Listo para tu evento?</span>
              <h2 className="titulo-display text-4xl sm:text-5xl mt-3">
                Reserva tus Caballos
              </h2>
              <p className="text-crema/70 mt-3">
                Déjanos tus datos y te contactamos para crear una experiencia a
                tu medida.
              </p>
            </Revelar>

            <Revelar anim="subir" retardo={120}>
              <div className="panel p-6 sm:p-9">
                <FormReserva />
              </div>

              <div className="text-center mt-8 text-crema/70">
                <p>O escríbenos directo:</p>
                <div className="flex flex-wrap gap-4 justify-center mt-3">
                  <a
                    href={`https://wa.me/${contacto.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--fantasma"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${contacto.telefono}`}
                    className="btn btn--fantasma"
                  >
                    {contacto.telefono}
                  </a>
                </div>
              </div>
            </Revelar>
          </div>
        </section>
      </main>

      {/* ====================== FOOTER ====================== */}
      <footer className="bg-carbon border-t border-cuero/40 py-12 px-5">
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
