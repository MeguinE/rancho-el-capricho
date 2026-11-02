import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

/** Pantalla para una ruta que no existe, con el tono del resto del sitio. */
export default function NoEncontrada() {
  return (
    <main className="min-h-[100svh] grid place-items-center px-5 py-20 text-center">
      <div>
        <p className="titulo-display texto-fuego text-[clamp(5rem,20vw,11rem)] leading-none">
          404
        </p>

        <div className="soga max-w-[12rem] mx-auto mt-2 opacity-70" />

        <h1 className="titulo-display text-3xl sm:text-4xl mt-8">
          Te desviaste del camino
        </h1>
        <p className="text-crema/70 mt-4 max-w-md mx-auto leading-relaxed">
          Esta vereda no lleva a ningún corral. Vuelve al rancho y sigue por el
          camino principal.
        </p>

        <Link href="/" className="btn btn--fuego mt-9">
          Volver al rancho
        </Link>
      </div>
    </main>
  );
}
