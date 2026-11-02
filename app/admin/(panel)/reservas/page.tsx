import { getSupabaseAdmin, adminConfigurado } from "@/lib/supabaseAdmin";
import {
  cambiarEstadoReservaAction,
  eliminarReservaAction,
} from "@/app/admin/acciones";
import { BotonSubmit, BotonEliminar } from "@/components/admin/Botones";

export const dynamic = "force-dynamic";

type Reserva = {
  id: string;
  creado_en: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  tipo_evento: string | null;
  fecha_evento: string | null;
  num_caballos: number | null;
  mensaje: string | null;
  estado: string;
};

const estadoEstilo: Record<string, string> = {
  nueva: "bg-atardecer/20 text-atardecer border-atardecer/40",
  contactada: "bg-blue-500/15 text-blue-300 border-blue-400/40",
  cerrada: "bg-green-500/15 text-green-300 border-green-400/40",
};

export default async function ReservasPage() {
  if (!adminConfigurado()) {
    return (
      <p className="text-crema/70">
        Configura <code className="text-atardecer">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
        para ver las reservas.
      </p>
    );
  }

  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from("reservas")
    .select("*")
    .order("creado_en", { ascending: false });

  const reservas = (data as Reserva[]) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-slab font-bold text-3xl text-crema">Reservas</h1>
        <p className="text-crema/60 mt-1">
          {reservas.length} solicitud(es) en total.
        </p>
      </div>

      {error && (
        <p className="text-red-300 bg-red-500/10 border border-red-500/40 rounded px-4 py-2">
          {error.message}
        </p>
      )}

      {reservas.length === 0 ? (
        <div className="tarjeta p-10 text-center text-crema/60">
          Aún no hay reservas. Cuando alguien envíe el formulario del sitio,
          aparecerá aquí.
        </div>
      ) : (
        <div className="space-y-4">
          {reservas.map((r) => (
            <article key={r.id} className="tarjeta p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-slab text-xl text-crema">{r.nombre}</h2>
                  <p className="text-crema/50 text-xs mt-0.5">
                    {new Date(r.creado_en).toLocaleString("es-MX", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <span
                  className={`text-xs uppercase tracking-wider border rounded-full px-3 py-1 ${
                    estadoEstilo[r.estado] ?? estadoEstilo.nueva
                  }`}
                >
                  {r.estado}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 text-sm">
                <Dato etiqueta="Evento" valor={r.tipo_evento} />
                <Dato
                  etiqueta="Fecha"
                  valor={
                    r.fecha_evento
                      ? new Date(r.fecha_evento).toLocaleDateString("es-MX")
                      : null
                  }
                />
                <Dato etiqueta="Caballos" valor={r.num_caballos?.toString()} />
                <Dato
                  etiqueta="Contacto"
                  valor={
                    [r.telefono, r.email].filter(Boolean).join(" · ") || null
                  }
                />
              </div>

              {r.mensaje && (
                <p className="text-crema/75 text-sm mt-3 bg-[#0f0b08]/50 rounded p-3 border border-cuero/20">
                  “{r.mensaje}”
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-cuero/20">
                {/* Contacto rápido */}
                {r.telefono && (
                  <a
                    href={`https://wa.me/${r.telefono.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-300 hover:underline text-sm"
                  >
                    WhatsApp
                  </a>
                )}
                {r.email && (
                  <a
                    href={`mailto:${r.email}`}
                    className="text-crema/70 hover:underline text-sm"
                  >
                    Correo
                  </a>
                )}

                {/* Cambiar estado */}
                <form
                  action={cambiarEstadoReservaAction}
                  className="flex items-center gap-2 ml-auto"
                >
                  <input type="hidden" name="id" value={r.id} />
                  <select
                    name="estado"
                    defaultValue={r.estado}
                    className="bg-[#0f0b08]/70 border border-cuero/50 rounded px-2 py-1.5 text-sm text-crema"
                  >
                    <option value="nueva">Nueva</option>
                    <option value="contactada">Contactada</option>
                    <option value="cerrada">Cerrada</option>
                  </select>
                  <BotonSubmit className="border border-cuero/50 text-crema hover:bg-cuero/30">
                    Actualizar
                  </BotonSubmit>
                </form>

                <form action={eliminarReservaAction}>
                  <input type="hidden" name="id" value={r.id} />
                  <BotonEliminar mensaje="¿Eliminar esta reserva definitivamente?" />
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Dato({
  etiqueta,
  valor,
}: {
  etiqueta: string;
  valor: string | null | undefined;
}) {
  return (
    <div>
      <div className="text-crema/40 text-xs uppercase tracking-wider">
        {etiqueta}
      </div>
      <div className="text-crema/90">{valor || "—"}</div>
    </div>
  );
}
