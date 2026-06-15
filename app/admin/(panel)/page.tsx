import Link from "next/link";
import { getSupabaseAdmin, adminConfigurado } from "@/lib/supabaseAdmin";
import {
  actualizarLogoAction,
  quitarLogoAction,
} from "@/app/admin/acciones";
import { BotonSubmit, BotonEliminar } from "@/components/admin/Botones";

export const dynamic = "force-dynamic";

async function resumen() {
  if (!adminConfigurado()) return null;
  const sb = getSupabaseAdmin();
  const [reservas, nuevas, caballos, galeria, logo] = await Promise.all([
    sb.from("reservas").select("id", { count: "exact", head: true }),
    sb
      .from("reservas")
      .select("id", { count: "exact", head: true })
      .eq("estado", "nueva"),
    sb.from("caballos").select("id", { count: "exact", head: true }),
    sb.from("galeria").select("id", { count: "exact", head: true }),
    sb.from("config").select("valor").eq("clave", "logo_url").maybeSingle(),
  ]);
  return {
    reservas: reservas.count ?? 0,
    nuevas: nuevas.count ?? 0,
    caballos: caballos.count ?? 0,
    galeria: galeria.count ?? 0,
    logo: logo.data?.valor ?? null,
  };
}

export default async function AdminInicio() {
  const datos = await resumen();

  if (!datos) {
    return (
      <div className="card-rancho p-6">
        <h1 className="font-slab text-2xl text-crema mb-2">Casi listo</h1>
        <p className="text-crema/70">
          Falta configurar la variable{" "}
          <code className="text-atardecer">SUPABASE_SERVICE_ROLE_KEY</code> en el
          servidor (y en Vercel) para poder administrar los datos. Revisa el{" "}
          <code className="text-atardecer">.env.local.example</code>.
        </p>
      </div>
    );
  }

  const tarjetas = [
    { t: "Reservas", n: datos.reservas, extra: `${datos.nuevas} nuevas`, href: "/admin/reservas" },
    { t: "Caballos", n: datos.caballos, href: "/admin/caballos" },
    { t: "Fotos en galería", n: datos.galeria, href: "/admin/galeria" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-slab font-bold text-3xl text-crema">Hola, vaquero 🤠</h1>
        <p className="text-crema/60 mt-1">
          Aquí administras tu rancho. Todo lo que cambies se actualiza en el sitio.
        </p>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid sm:grid-cols-3 gap-5">
        {tarjetas.map((c) => (
          <Link
            key={c.t}
            href={c.href}
            className="card-rancho p-6 block hover:no-underline"
          >
            <div className="text-crema/60 text-sm uppercase tracking-wider">
              {c.t}
            </div>
            <div className="font-slab font-bold text-4xl text-atardecer mt-1">
              {c.n}
            </div>
            {c.extra && (
              <div className="text-crema/50 text-xs mt-1">{c.extra}</div>
            )}
          </Link>
        ))}
      </div>

      {/* Logo */}
      <div className="card-rancho p-6">
        <h2 className="font-slab text-xl text-crema mb-4">Logo del sitio</h2>
        <div className="flex flex-wrap items-center gap-6">
          <div className="w-20 h-20 rounded-full border border-cuero-claro/50 overflow-hidden flex items-center justify-center bg-[#0f0b08]/60 shrink-0">
            {datos.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={datos.logo}
                alt="Logo actual"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-atardecer text-2xl">★</span>
            )}
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <form action={actualizarLogoAction} className="flex items-end gap-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-crema/60 mb-1">
                  Subir logo (PNG/JPG)
                </label>
                <input
                  name="imagen"
                  type="file"
                  accept="image/*"
                  required
                  className="text-sm text-crema/80 file:mr-3 file:rounded file:border-0 file:bg-cuero file:text-crema file:px-3 file:py-1.5 file:cursor-pointer"
                />
              </div>
              <BotonSubmit className="bg-atardecer text-[#1a1410] hover:bg-cuero-claro">
                Guardar
              </BotonSubmit>
            </form>
            {datos.logo && (
              <form action={quitarLogoAction}>
                <BotonEliminar mensaje="¿Quitar el logo y volver a la estrella por defecto?">
                  Quitar
                </BotonEliminar>
              </form>
            )}
          </div>
        </div>
        <p className="text-crema/40 text-xs mt-3">
          Si no pones logo, se usa la herradura/estrella por defecto.
        </p>
      </div>
    </div>
  );
}
