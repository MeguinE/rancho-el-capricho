import Navbar from "@/components/Navbar";
import Marquee from "@/components/Marquee";
import Hero from "@/components/secciones/Hero";
import Historia from "@/components/secciones/Historia";
import Caballos from "@/components/secciones/Caballos";
import Cita from "@/components/secciones/Cita";
import Servicios from "@/components/secciones/Servicios";
import Pasos from "@/components/secciones/Pasos";
import Galeria from "@/components/secciones/Galeria";
import Testimonios from "@/components/secciones/Testimonios";
import Reservar from "@/components/secciones/Reservar";
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

        <Galeria fotos={galeria} />
        <Testimonios />

        <Reservar />
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
