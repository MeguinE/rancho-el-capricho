import type { NextConfig } from "next";

/**
 * Host del proyecto de Supabase, leído de la variable de entorno.
 *
 * Las imágenes que se suben desde /admin viven en el Storage de Supabase, así
 * que su dominio cambia en cada proyecto. Derivarlo de la variable evita tener
 * que escribirlo a mano aquí y permite usar `next/image` (con su optimización
 * y su `srcset`) en lugar de una etiqueta `<img>` suelta.
 */
function hostDeSupabase(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const supabase = hostDeSupabase();

const nextConfig: NextConfig = {
  // Permite subir imágenes (logo, caballos, galería) desde el panel de admin.
  // El límite por defecto de las Server Actions es 1 MB.
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
  images: {
    remotePatterns: [
      // Fotos de demostración mientras no haya fotos propias.
      { protocol: "https", hostname: "images.unsplash.com" },
      // Imágenes subidas desde el panel.
      ...(supabase
        ? [
            {
              protocol: "https" as const,
              hostname: supabase,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
