import { contacto, rancho } from "@/lib/data";

/*
  Datos del sitio que necesitan los metadatos, el sitemap y los datos
  estructurados. Separados de lib/data.ts porque esto no es contenido que se
  edite: es identidad técnica del sitio.
*/

/**
 * URL pública del sitio.
 *
 * En local y en las vistas previas no hay dominio fijo, así que se intenta en
 * este orden: la variable propia, la que Vercel inyecta en cada despliegue y,
 * si no hay ninguna, localhost. `metadataBase` la necesita para convertir las
 * rutas relativas de Open Graph en absolutas.
 */
function urlDelSitio(): string {
  const propia = process.env.NEXT_PUBLIC_SITE_URL;
  if (propia) return propia.replace(/\/$/, "");

  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const SITIO = {
  url: urlDelSitio(),
  nombre: rancho.nombre,
  titulo: `${rancho.nombre} · Caballos para eventos`,
  descripcion:
    "Renta de caballos para bodas, XV años, cabalgatas y eventos sociales. " +
    "Caballos dóciles, entrenados y espectaculares ante la cámara.",
  idioma: "es-MX",
} as const;

/**
 * Ficha de negocio en JSON-LD.
 *
 * Es lo que permite que Google muestre el teléfono, la ubicación y las redes
 * en los resultados en vez de solo el título y un trozo de texto. Sale de
 * lib/data.ts, así que se actualiza solo cuando el rancho cambie sus datos.
 */
export function fichaDeNegocio() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: rancho.nombre,
    description: SITIO.descripcion,
    url: SITIO.url,
    telephone: contacto.telefono,
    email: contacto.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contacto.ubicacion,
      addressCountry: "MX",
    },
    foundingDate: String(rancho.desde),
    sameAs: [contacto.instagram, contacto.facebook].filter(Boolean),
    areaServed: "México",
    knowsLanguage: "es",
  };
}
