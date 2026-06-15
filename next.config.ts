import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite subir imágenes (logo, caballos, galería) desde el panel de admin.
  // El límite por defecto de las Server Actions es 1 MB.
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
  images: {
    // Permite cargar las fotos de demostración (Unsplash).
    // Cuando subas TUS fotos a /public/img ya no dependerás de esto,
    // pero puedes dejarlo sin problema.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
