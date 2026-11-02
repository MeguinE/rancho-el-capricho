import type { Metadata, Viewport } from "next";
import { Rye, Oswald, Zilla_Slab } from "next/font/google";
import "./globals.css";

/*
  Tres tipografías, cada una con un papel claro:
    Rye        → títulos grandes. Es la voz "cartel del viejo oeste".
    Zilla Slab → títulos de interfaz, navegación y etiquetas.
    Oswald     → texto corrido y botones. Condensada y muy legible.

  `display: "swap"` muestra el texto desde el primer instante con la fuente del
  sistema y la cambia al cargar, en lugar de dejar un hueco en blanco.
*/
const rye = Rye({
  variable: "--font-rye",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

const zillaSlab = Zilla_Slab({
  variable: "--font-zilla",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rancho el Capricho · Caballos para eventos",
  description:
    "Renta de caballos para bodas, XV años, cabalgatas y eventos sociales. Vive la experiencia vaquera en Rancho el Capricho.",
  openGraph: {
    title: "Rancho el Capricho · Caballos para eventos",
    description:
      "Renta de caballos para bodas, XV años, cabalgatas y eventos sociales.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1410",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${rye.variable} ${oswald.variable} ${zillaSlab.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col fondo-rancho grano">
        {/* Primer tabulador de la página: permite saltarse la navegación */}
        <a href="#contenido" className="salto-contenido">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
