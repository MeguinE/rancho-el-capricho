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
import PieRancho from "@/components/secciones/PieRancho";
import { cintaItems } from "@/lib/data";
import { fichaDeNegocio } from "@/lib/sitio";
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
      {/* Ficha de negocio para los buscadores: teléfono, ubicación y redes en
          los resultados, no solo el título. Sale de lib/data.ts. */}
      <script
        type="application/ld+json"
        // El contenido es nuestro y se serializa con JSON.stringify, no texto
        // que venga de fuera.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(fichaDeNegocio()) }}
      />

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

      <PieRancho />
    </>
  );
}
