import Image from "next/image";
import { getSupabaseAdmin, adminConfigurado } from "@/lib/supabaseAdmin";
import {
  agregarGaleriaAction,
  eliminarGaleriaAction,
} from "@/app/admin/acciones";
import { BotonSubmit, BotonEliminar } from "@/components/admin/Botones";
import AvisoFalta from "@/components/admin/AvisoFalta";

export const dynamic = "force-dynamic";

type Item = { id: string; url: string; alt: string | null };

export default async function GaleriaPage() {
  if (!adminConfigurado()) {
    return <AvisoFalta accion="gestionar la galería" />;
  }

  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("galeria")
    .select("id, url, alt")
    .order("orden", { ascending: true });
  const items = (data as Item[]) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-slab font-bold text-3xl text-crema">Galería</h1>
        <p className="text-crema/60 mt-1.5">
          Sube las fotos de tus eventos: aparecen en el mosaico del sitio.
        </p>
      </div>

      <form
        action={agregarGaleriaAction}
        className="tarjeta p-5 flex flex-wrap items-end gap-4"
      >
        <div>
          <label htmlFor="imagen" className="etiqueta-campo text-[0.68rem]">
            Imagen
          </label>
          <input
            id="imagen"
            name="imagen"
            type="file"
            accept="image/*"
            required
            className="campo-archivo"
          />
        </div>

        <div className="flex-1 min-w-[16rem]">
          <label htmlFor="alt" className="etiqueta-campo text-[0.68rem]">
            Descripción
          </label>
          <input
            id="alt"
            name="alt"
            type="text"
            placeholder="Boda en el rancho al atardecer"
            className="campo campo--compacto"
          />
          <p className="text-crema/40 text-xs mt-1.5">
            Describe la foto: es lo que leen los buscadores y quien navega con
            lector de pantalla.
          </p>
        </div>

        <BotonSubmit
          className="bg-atardecer text-madera hover:bg-cuero-claro"
          pendingText="Subiendo…"
        >
          Subir foto
        </BotonSubmit>
      </form>

      {items.length === 0 ? (
        <div className="tarjeta p-10 text-center text-crema/60">
          La galería está vacía. Sube tu primera foto aquí arriba.
        </div>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((g) => (
            <li
              key={g.id}
              className="group relative aspect-square rounded-lg overflow-hidden border border-cuero/40"
            >
              <Image
                src={g.url}
                alt={g.alt ?? ""}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
              />

              {/* Los controles aparecen al pasar el cursor, pero también al
                  llegar el foco del teclado (focus-within). */}
              <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-carbon via-carbon/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                {g.alt && (
                  <p className="text-crema/90 text-xs mb-2 line-clamp-2">
                    {g.alt}
                  </p>
                )}
                <form action={eliminarGaleriaAction}>
                  <input type="hidden" name="id" value={g.id} />
                  <input type="hidden" name="url" value={g.url} />
                  <BotonEliminar mensaje="¿Eliminar esta foto de la galería?" />
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
