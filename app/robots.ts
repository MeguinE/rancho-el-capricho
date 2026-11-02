import type { MetadataRoute } from "next";
import { SITIO } from "@/lib/sitio";

/**
 * robots.txt generado.
 *
 * El panel queda fuera del índice: no tiene nada que buscar y no queremos que
 * la pantalla de acceso aparezca en resultados.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/admin",
      },
    ],
    sitemap: `${SITIO.url}/sitemap.xml`,
  };
}
