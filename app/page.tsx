import Navbar from "@/components/Navbar";
import FotoPlaceholder from "@/components/FotoPlaceholder";
import FormReserva from "@/components/FormReserva";
import { caballos, servicios, contacto } from "@/lib/data";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ====================== HERO ====================== */}
      <section
        id="inicio"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Fondo: reemplaza por una foto poniendo una imagen en /public/img/hero.jpg
            y descomenta el <Image> de abajo. Por ahora hay un degradado de atardecer. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #2a1c12 0%, #5a2f15 35%, #b85c2a 70%, #e07b39 100%)",
          }}
        />
        {/* Silueta de cerro/pasto */}
        <div
          className="absolute bottom-0 inset-x-0 h-40 bg-[#1a1410]"
          style={{
            clipPath:
              "polygon(0 60%, 12% 45%, 28% 58%, 45% 38%, 62% 55%, 80% 40%, 100% 58%, 100% 100%, 0 100%)",
          }}
        />
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative z-10 text-center px-5 max-w-4xl aparecer">
          <p className="font-[family-name:var(--font-rustico)] text-crema/90 tracking-[0.3em] uppercase text-sm sm:text-base mb-4">
            Desde el corazón del campo
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-cuero-claro text-5xl sm:text-7xl lg:text-8xl leading-none drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">
            Rancho el Capricho
          </h1>
          <p className="mt-6 text-crema text-lg sm:text-2xl max-w-2xl mx-auto">
            Caballos majestuosos para que tu evento sea legendario. Bodas, XV
            años, cabalgatas y sesiones de fotos con auténtico sabor vaquero.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#reservar" className="btn-rancho">
              🐎 Reservar caballos
            </a>
            <a href="#caballos" className="btn-rancho btn-fantasma">
              Conoce nuestros caballos
            </a>
          </div>
        </div>

        <a
          href="#caballos"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-crema/70 text-sm animate-bounce z-10"
        >
          ▼ Desliza
        </a>
      </section>

      {/* ====================== SOBRE EL RANCHO ====================== */}
      <section className="py-20 sm:py-28 px-5">
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-atardecer uppercase tracking-[0.25em] text-sm mb-3">
              Nuestra historia
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-cuero-claro text-4xl sm:text-5xl mb-6">
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
                { n: "+10", l: "Años de experiencia" },
                { n: "+15", l: "Caballos entrenados" },
                { n: "+200", l: "Eventos realizados" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="bg-[#0f0b08]/50 border border-cuero/40 rounded-lg p-4"
                >
                  <div className="font-[family-name:var(--font-display)] text-2xl text-atardecer">
                    {s.n}
                  </div>
                  <div className="text-crema/60 text-xs uppercase tracking-wider mt-1">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <FotoPlaceholder
            alt="Rancho el Capricho"
            etiqueta="Foto del rancho / panorámica"
            className="aspect-[4/5] rounded-lg"
          />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5">
        <div className="soga" />
      </div>

      {/* ====================== CABALLOS ====================== */}
      <section id="caballos" className="py-20 sm:py-28 px-5">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-atardecer uppercase tracking-[0.25em] text-sm mb-3">
              Las estrellas del rancho
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-cuero-claro text-4xl sm:text-5xl">
              Nuestros Caballos
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {caballos.map((c) => (
              <article
                key={c.nombre}
                className="bg-[#0f0b08]/50 border border-cuero/40 rounded-lg overflow-hidden hover:border-atardecer transition-colors group"
              >
                <FotoPlaceholder
                  src={c.img}
                  alt={c.nombre}
                  etiqueta={`Foto de ${c.nombre}`}
                  className="aspect-[4/3]"
                />
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-[family-name:var(--font-display)] text-2xl text-cuero-claro">
                      {c.nombre}
                    </h3>
                    <span className="text-xs uppercase tracking-wider text-atardecer">
                      {c.raza}
                    </span>
                  </div>
                  <p className="text-crema/70 text-sm mt-2 leading-relaxed">
                    {c.descripcion}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== SERVICIOS / EVENTOS ====================== */}
      <section
        id="servicios"
        className="py-20 sm:py-28 px-5 bg-[#0f0b08]/40 border-y border-cuero/30"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-atardecer uppercase tracking-[0.25em] text-sm mb-3">
              Lo que ofrecemos
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-cuero-claro text-4xl sm:text-5xl">
              Eventos & Servicios
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {servicios.map((s) => (
              <div
                key={s.titulo}
                className="text-center p-7 rounded-lg border border-cuero/40 bg-[#1a1410]/60 hover:-translate-y-1 transition-transform"
              >
                <div className="text-5xl mb-4">{s.icono}</div>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-cuero-claro mb-2">
                  {s.titulo}
                </h3>
                <p className="text-crema/70 text-sm leading-relaxed">
                  {s.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== GALERÍA ====================== */}
      <section id="galeria" className="py-20 sm:py-28 px-5">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-atardecer uppercase tracking-[0.25em] text-sm mb-3">
              Momentos en el rancho
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-cuero-claro text-4xl sm:text-5xl">
              Galería
            </h2>
            <p className="text-crema/60 mt-3 max-w-xl mx-auto">
              Aquí van tus mejores fotos de eventos. Sustituye los marcos
              poniendo imágenes en{" "}
              <code className="text-cuero-claro">/public/img</code>.
            </p>
          </div>

          {/* Mosaico tipo galería */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px]">
            <FotoPlaceholder
              alt="Galería 1"
              etiqueta="Evento 1"
              className="col-span-2 row-span-2 rounded-lg"
            />
            <FotoPlaceholder alt="Galería 2" etiqueta="Evento 2" className="rounded-lg" />
            <FotoPlaceholder alt="Galería 3" etiqueta="Evento 3" className="rounded-lg" />
            <FotoPlaceholder
              alt="Galería 4"
              etiqueta="Evento 4"
              className="col-span-2 rounded-lg"
            />
            <FotoPlaceholder alt="Galería 5" etiqueta="Evento 5" className="rounded-lg" />
            <FotoPlaceholder alt="Galería 6" etiqueta="Evento 6" className="rounded-lg" />
            <FotoPlaceholder
              alt="Galería 7"
              etiqueta="Evento 7"
              className="col-span-2 rounded-lg"
            />
            <FotoPlaceholder alt="Galería 8" etiqueta="Evento 8" className="rounded-lg" />
          </div>
        </div>
      </section>

      {/* ====================== RESERVAR ====================== */}
      <section
        id="reservar"
        className="py-20 sm:py-28 px-5 bg-[#0f0b08]/40 border-y border-cuero/30"
      >
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-atardecer uppercase tracking-[0.25em] text-sm mb-3">
              ¿Listo para tu evento?
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-cuero-claro text-4xl sm:text-5xl">
              Reserva tus Caballos
            </h2>
            <p className="text-crema/70 mt-3">
              Déjanos tus datos y te contactamos para crear una experiencia a tu
              medida.
            </p>
          </div>

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
                💬 WhatsApp
              </a>
              <a href={`tel:${contacto.telefono}`} className="btn-rancho btn-fantasma">
                📞 {contacto.telefono}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== FOOTER ====================== */}
      <footer className="bg-[#0f0b08] border-t border-cuero/40 py-12 px-5">
        <div className="mx-auto max-w-6xl grid sm:grid-cols-3 gap-8">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-cuero-claro text-2xl mb-3">
              Rancho el Capricho
            </h3>
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
