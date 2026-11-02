import Link from "next/link";
import { getSupabaseAdmin, adminConfigurado } from "@/lib/supabaseAdmin";
import {
  cambiarEstadoReservaAction,
  eliminarReservaAction,
} from "@/app/admin/acciones";
import { BotonSubmit, BotonEliminar } from "@/components/admin/Botones";
import AvisoFalta from "@/components/admin/AvisoFalta";

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
  lugar: string | null;
  invitados: number | null;
  mensaje: string | null;
  estado: string;
};

const ESTADOS = ["nueva", "contactada", "cerrada"] as const;
type Estado = (typeof ESTADOS)[number];

const estilos: Record<Estado, string> = {
  nueva: "text-atardecer bg-atardecer/12",
  contactada: "text-[#93c5fd] bg-[#93c5fd]/12",
  cerrada: "text-[#9ae6a4] bg-[#9ae6a4]/12",
};

const etiquetas: Record<Estado, string> = {
  nueva: "Nuevas",
  contactada: "Contactadas",
  cerrada: "Cerradas",
};

function esEstado(valor: string | undefined): valor is Estado {
  return ESTADOS.includes(valor as Estado);
}

export default async function ReservasPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  if (!adminConfigurado()) {
    return <AvisoFalta accion="ver las reservas" />;
  }

  const { estado: filtroCrudo } = await searchParams;
  const filtro = esEstado(filtroCrudo) ? filtroCrudo : null;

  const sb = getSupabaseAdmin();
  const consulta = sb
    .from("reservas")
    .select("*")
    .order("creado_en", { ascending: false });

  const { data, error } = await (filtro
    ? consulta.eq("estado", filtro)
    : consulta);

  const reservas = (data as Reserva[]) ?? [];

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-slab font-bold text-3xl text-crema">Reservas</h1>
        <p className="text-crema/60 mt-1.5">
          {filtro
            ? `${reservas.length} ${etiquetas[filtro].toLowerCase()}.`
            : `${reservas.length} solicitud(es) en total.`}
        </p>
      </div>

      <nav aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
        <Filtro href="/admin/reservas" activo={filtro === null}>
          Todas
        </Filtro>
        {ESTADOS.map((e) => (
          <Filtro
            key={e}
            href={`/admin/reservas?estado=${e}`}
            activo={filtro === e}
          >
            {etiquetas[e]}
          </Filtro>
        ))}
      </nav>

      {error && (
        <p
          role="alert"
          className="text-[#ffb3a3] bg-sangre/25 border border-sangre rounded-lg px-4 py-3"
        >
          {error.message}
        </p>
      )}

      {reservas.length === 0 ? (
        <div className="tarjeta p-10 text-center text-crema/60">
          {filtro
            ? "No hay solicitudes en este estado."
            : "Aún no hay reservas. Cuando alguien complete el formulario del sitio, aparecerá aquí."}
        </div>
      ) : (
        <ul className="space-y-4">
          {reservas.map((r) => (
            <li key={r.id}>
              <Tarjeta reserva={r} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Filtro({
  href,
  activo,
  children,
}: {
  href: string;
  activo: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={activo ? "page" : undefined}
      className={`text-xs uppercase tracking-[0.14em] rounded-full px-4 py-2 border transition-colors ${
        activo
          ? "border-atardecer text-atardecer bg-atardecer/10"
          : "border-cuero/45 text-crema/60 hover:text-crema hover:border-cuero-claro/70"
      }`}
    >
      {children}
    </Link>
  );
}

function Tarjeta({ reserva: r }: { reserva: Reserva }) {
  const estado: Estado = esEstado(r.estado) ? r.estado : "nueva";

  return (
    <article className="tarjeta p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-slab font-semibold text-xl text-crema">
            {r.nombre}
          </h2>
          {/* La hora es un dato de máquina: <time> permite leerla como tal. */}
          <time
            dateTime={r.creado_en}
            className="text-crema/45 text-xs mt-0.5 block"
          >
            {new Date(r.creado_en).toLocaleString("es-MX", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </time>
        </div>
        <span
          className={`insignia border-transparent ${estilos[estado]}`}
        >
          {estado}
        </span>
      </header>

      <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 mt-5 text-sm">
        <Dato etiqueta="Evento" valor={r.tipo_evento} />
        <Dato
          etiqueta="Fecha"
          valor={
            r.fecha_evento
              ? new Date(`${r.fecha_evento}T12:00:00`).toLocaleDateString(
                  "es-MX",
                  { dateStyle: "long" }
                )
              : null
          }
        />
        <Dato etiqueta="Caballos" valor={r.num_caballos?.toString()} />
        <Dato etiqueta="Teléfono" valor={r.telefono} />
        <Dato etiqueta="Correo" valor={r.email} />
        <Dato etiqueta="Invitados" valor={r.invitados?.toString()} />
        <Dato etiqueta="Lugar" valor={r.lugar} className="sm:col-span-2" />
      </dl>

      {r.mensaje && (
        <p className="text-crema/75 text-sm mt-4 bg-carbon/50 rounded-lg p-4 border border-cuero/25 italic">
          {r.mensaje}
        </p>
      )}

      <footer className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-cuero/25">
        {r.telefono && (
          <a
            href={`https://wa.me/${r.telefono.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9ae6a4] hover:underline text-sm"
          >
            WhatsApp ↗
          </a>
        )}
        {r.email && (
          <a
            href={`mailto:${r.email}`}
            className="text-crema/70 hover:underline text-sm"
          >
            Escribir correo
          </a>
        )}

        <form
          action={cambiarEstadoReservaAction}
          className="flex items-center gap-2 ml-auto"
        >
          <input type="hidden" name="id" value={r.id} />
          <label htmlFor={`estado-${r.id}`} className="sr-only">
            Estado de la solicitud de {r.nombre}
          </label>
          <select
            id={`estado-${r.id}`}
            name="estado"
            defaultValue={estado}
            className="campo campo--compacto w-auto"
          >
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {etiquetas[e].replace(/s$/, "")}
              </option>
            ))}
          </select>
          <BotonSubmit className="border border-cuero/50 text-crema hover:bg-cuero/30">
            Actualizar
          </BotonSubmit>
        </form>

        <form action={eliminarReservaAction}>
          <input type="hidden" name="id" value={r.id} />
          <BotonEliminar mensaje="¿Eliminar esta reserva definitivamente?" />
        </form>
      </footer>
    </article>
  );
}

function Dato({
  etiqueta,
  valor,
  className = "",
}: {
  etiqueta: string;
  valor: string | null | undefined;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-crema/40 text-[0.64rem] uppercase tracking-[0.14em]">
        {etiqueta}
      </dt>
      <dd className="text-crema/90 mt-0.5">{valor || "—"}</dd>
    </div>
  );
}
