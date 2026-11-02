/**
 * Esqueleto de carga del panel.
 *
 * Las páginas del panel leen de Supabase en cada visita, así que esta pantalla
 * se ve de verdad. Reserva el mismo espacio que el contenido real para que al
 * llegar los datos nada salte de sitio.
 */
export default function CargandoPanel() {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">Cargando…</span>

      <div className="space-y-3">
        <div className="hueso h-8 w-64" />
        <div className="hueso h-4 w-80" />
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="tarjeta p-6 space-y-3">
            <div className="hueso h-3 w-24" />
            <div className="hueso h-9 w-16" />
          </div>
        ))}
      </div>

      <div className="tarjeta p-6 space-y-4">
        <div className="hueso h-5 w-40" />
        <div className="hueso h-20 w-full" />
      </div>
    </div>
  );
}
