"use client";

import { useEffect } from "react";

/**
 * Pantalla de error inesperado.
 *
 * Tiene que ser un componente de cliente: recibe `reset`, que vuelve a montar
 * el árbol que falló sin recargar toda la página.
 *
 * No muestra el mensaje de error al visitante (puede filtrar detalles de la
 * base de datos o del servidor); lo deja en la consola, donde sí sirve.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[error no controlado]", error);
  }, [error]);

  return (
    <main className="min-h-[100svh] grid place-items-center px-5 py-20 text-center">
      <div>
        <p className="text-5xl" aria-hidden="true">
          🐎
        </p>

        <h1 className="titulo-display text-3xl sm:text-4xl mt-6">
          Se nos espantó el caballo
        </h1>
        <p className="text-crema/70 mt-4 max-w-md mx-auto leading-relaxed">
          Algo salió mal de nuestro lado. Inténtalo otra vez; si sigue igual,
          escríbenos y lo resolvemos.
        </p>

        {error.digest && (
          <p className="text-crema/35 text-xs mt-5">
            Referencia: <code>{error.digest}</code>
          </p>
        )}

        <div className="flex flex-wrap gap-3 justify-center mt-9">
          <button type="button" onClick={reset} className="btn btn--fuego">
            Reintentar
          </button>
          <a href="/" className="btn btn--fantasma">
            Ir al inicio
          </a>
        </div>
      </div>
    </main>
  );
}
