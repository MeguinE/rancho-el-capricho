import Link from "next/link";
import Icono from "@/components/Icono";
import { contacto, rancho } from "@/lib/data";

const navegacion = [
  { href: "#historia", texto: "El Rancho" },
  { href: "#caballos", texto: "Caballos" },
  { href: "#servicios", texto: "Eventos" },
  { href: "#galeria", texto: "Galería" },
  { href: "#testimonios", texto: "Opiniones" },
  { href: "#reservar", texto: "Reservar" },
];

const redes = [
  { href: contacto.instagram, nombre: "Instagram", icono: "instagram" },
  { href: contacto.facebook, nombre: "Facebook", icono: "facebook" },
  {
    href: `https://wa.me/${contacto.whatsapp}`,
    nombre: "WhatsApp",
    icono: "whatsapp",
  },
];

/** Pie de página con contacto, navegación y acceso al panel. */
export default function PieRancho() {
  return (
    <footer className="relative bg-carbon border-t border-cuero/35">
      <div className="mx-auto max-w-6xl px-5 pt-14 pb-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <p className="titulo-display text-2xl">{rancho.nombre}</p>
            <p className="text-crema/60 text-sm leading-relaxed mt-3 max-w-sm">
              {rancho.lema}. Tradición, nobleza y momentos inolvidables desde{" "}
              {rancho.desde}.
            </p>

            <ul className="flex gap-3 mt-6">
              {redes.map((r) => (
                <li key={r.nombre}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={r.nombre}
                    className="grid place-items-center w-10 h-10 rounded-full border border-cuero/50 text-crema/70 transition-colors duration-300 hover:border-atardecer hover:text-atardecer"
                  >
                    <Icono name={r.icono} className="w-[18px] h-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Secciones del sitio">
            <h2 className="antetitulo antetitulo--izq">Explora</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navegacion.map((e) => (
                <li key={e.href}>
                  <a href={e.href} className="enlace-pie">
                    {e.texto}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="antetitulo antetitulo--izq">Contacto</h2>
            {/* <address> es la etiqueta correcta para los datos de contacto del
                propio sitio, aunque el navegador la ponga en cursiva. */}
            <address className="mt-4 space-y-2.5 text-sm not-italic">
              <p className="text-crema/65 flex gap-2.5">
                <span aria-hidden="true">📍</span>
                {contacto.ubicacion}
              </p>
              <p className="flex gap-2.5">
                <span aria-hidden="true">📞</span>
                <a
                  href={`tel:${contacto.telefono.replace(/\s/g, "")}`}
                  className="enlace-pie"
                >
                  {contacto.telefono}
                </a>
              </p>
              <p className="flex gap-2.5">
                <span aria-hidden="true">✉️</span>
                <a href={`mailto:${contacto.email}`} className="enlace-pie">
                  {contacto.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="soga mt-11 opacity-50" />

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-crema/40 text-xs">
          <p>
            © {new Date().getFullYear()} {rancho.nombre}. Hecho con 🤠 en el
            campo.
          </p>
          <Link href="/admin" className="enlace-pie">
            Panel de administración
          </Link>
        </div>
      </div>

      <a
        href="#inicio"
        className="boton-arriba"
        aria-label="Volver arriba"
        title="Volver arriba"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
          <path
            d="M12 19V6M6 12l6-6 6 6"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </a>
    </footer>
  );
}
