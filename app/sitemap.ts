import type { MetadataRoute } from "next";
import { SITIO } from "@/lib/sitio";

/** El sitio es una sola página: el mapa tiene una entrada. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITIO.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
