import Link from "next/link";
import Image from "next/image";
import { getSupabaseAdmin, adminConfigurado } from "@/lib/supabaseAdmin";
import { actualizarLogoAction, quitarLogoAction } from "@/app/admin/acciones";
import { BotonSubmit, BotonEliminar } from "@/components/admin/Botones";
import AvisoFalta from "@/components/admin/AvisoFalta";

export const dynamic = "force-dynamic";

async function resumen() {
  const sb = getSupabaseAdmin();
  const cuenta = (tabla: string) =>
    sb.from(tabla).select("id", { count: "exact", head: true });

  const [reservas, nuevas, caballos, galeria, logo] = await Promise.all([
    cuenta("reservas"),
    sb
      .from("reservas")
      .select("id", { count: "exact", head: true })
      .eq("estado", "nueva"),
    cuenta("caballos"),
    cuenta("galeria"),
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
  if (!adminConfigurado()) {
    return <AvisoFalta accion="administrar los datos del rancho" />;
  }

  const datos = await resumen();

  const tarjetas = [
    {
      titulo: "Reservas",
      valor: datos.reservas,
      extra: datos.nuevas > 0 ? `${datos.nuevas} sin contactar` : "Todo al día",
      destacar: datos.nuevas > 0,
      href: "/admin/reservas",
    },
    {
      titulo: "Caballos",
      valor: datos.caballos,
      extra: "En el sitio",
      href: "/admin/caballos",
    },
    {
      titulo: "Fotos en galería",
      valor: datos.galeria,
      extra: "En el mosaico",
      href: "/admin/galeria",
    },
  ];

  return (
    <div className="space-y-9">
      <div>
        <h1 className="font-slab font-bold text-3xl text-crema">
          Hola, vaquero 🤠
        </h1>
        <p className="text-crema/60 mt-1.5">
          Aquí administras tu rancho. Todo lo que cambies se actualiza en el
          sitio al momento.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        {tarjetas.map((c) => (
          <Link
            key={c.titulo}
            href={c.href}
            className="grupo-tarjeta tarjeta tarjeta--foco p-6 block"
          >
            <p className="text-crema/55 text-xs uppercase tracking-[0.16em]">
              {c.titulo}
            </p>
            <p className="font-slab font-bold text-4xl text-atardecer mt-1.5 tabular-nums">
              {c.valor}
            </p>
            <p
              className={`text-xs mt-1.5 ${
                c.destacar ? "text-atardecer" : "text-crema/45"
              }`}
            >
              {c.extra}
            </p>
          </Link>
        ))}
      </div>

      <section className="tarjeta p-6">
        <h2 className="font-slab font-semibold text-xl text-crema">
          Logo del sitio
        </h2>
        <p className="text-crema/50 text-sm mt-1">
          Si no pones logo, el sitio usa la herradura con el nombre del rancho.
        </p>

        <div className="flex flex-wrap items-end gap-6 mt-6">
          <div className="relative w-24 h-24 shrink-0 rounded-xl border border-cuero-claro/45 overflow-hidden bg-carbon/60 grid place-items-center">
            {datos.logo ? (
              <Image
                src={datos.logo}
                alt="Logo actual del sitio"
                fill
                sizes="96px"
                className="object-contain p-2"
              />
            ) : (
              <span className="text-atardecer text-2xl" aria-hidden="true">
                ★
              </span>
            )}
          </div>

          <form
            action={actualizarLogoAction}
            className="flex flex-wrap items-end gap-3"
          >
            <div>
              <label htmlFor="logo" className="etiqueta-campo text-[0.68rem]">
                Subir logo (PNG o JPG)
              </label>
              <input
                id="logo"
                name="imagen"
                type="file"
                accept="image/*"
                required
                className="campo-archivo"
              />
            </div>
            <BotonSubmit className="bg-atardecer text-madera hover:bg-cuero-claro">
              Guardar
            </BotonSubmit>
          </form>

          {datos.logo && (
            <form action={quitarLogoAction}>
              <BotonEliminar mensaje="¿Quitar el logo y volver a la estrella por defecto?">
                Quitar logo
              </BotonEliminar>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
