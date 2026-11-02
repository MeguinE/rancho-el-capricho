import Navbar from "@/components/Navbar";
import FotoPlaceholder from "@/components/FotoPlaceholder";
import FormReserva from "@/components/FormReserva";
import Revelar from "@/components/anim/Revelar";
import Marquee from "@/components/Marquee";
import Hero from "@/components/secciones/Hero";
import Historia from "@/components/secciones/Historia";
import Caballos from "@/components/secciones/Caballos";
import Cita from "@/components/secciones/Cita";
import Servicios from "@/components/secciones/Servicios";
import Pasos from "@/components/secciones/Pasos";
import Testimonios from "@/components/secciones/Testimonios";
import { contacto, cintaItems } from "@/lib/data";
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
        <Marquee items={cintaItems} />
        <Historia />
        <Caballos caballos={caballos} />
        <Cita />
        <Servicios />
        <Pasos />

        {/* ====================== GALERÍA ====================== */}
        <section
          id="galeria"
          className="py-20 sm:py-28 px-5 bg-noche/55 border-y border-cuero/25"
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

        <Testimonios />

        {/* ====================== RESERVAR ====================== */}
        <section
          id="reservar"
          className="py-20 sm:py-28 px-5 bg-noche/55 border-y border-cuero/25"
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
