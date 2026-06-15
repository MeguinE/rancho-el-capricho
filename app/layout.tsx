import type { Metadata } from "next";
import { Rye, Special_Elite, Oswald, Zilla_Slab } from "next/font/google";
import "./globals.css";

// Tipografías con carácter western
const rye = Rye({
  variable: "--font-rye",
  weight: "400",
  subsets: ["latin"],
});

const specialElite = Special_Elite({
  variable: "--font-special-elite",
  weight: "400",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

// Slab serif con carácter western pero legible (logo / navbar)
const zillaSlab = Zilla_Slab({
  variable: "--font-zilla",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${rye.variable} ${specialElite.variable} ${oswald.variable} ${zillaSlab.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-rancho grano">{children}</body>
    </html>
  );
}
