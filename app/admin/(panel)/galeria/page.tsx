import { getSupabaseAdmin, adminConfigurado } from "@/lib/supabaseAdmin";
import {
  agregarGaleriaAction,
  eliminarGaleriaAction,
} from "@/app/admin/acciones";
import { BotonSubmit, BotonEliminar } from "@/components/admin/Botones";

export const dynamic = "force-dynamic";

type Item = { id: string; url: string; alt: string | null };

export default async function GaleriaPage() {
  if (!adminConfigurado()) {
    return (
      <p className="text-crema/70">
        Configura{" "}
        <code className="text-atardecer">SUPABASE_SERVICE_ROLE_KEY</code> para
        gestionar la galería.
      </p>
    );
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
        <p className="text-crema/60 mt-1">
          Sube las fotos de tus eventos. Aparecen en el mosaico del sitio.
        </p>
      </div>

      {/* Subir nueva */}
      <form
        action={agregarGaleriaAction}
        className="card-rancho p-5 flex flex-wrap items-end gap-4"
      >
        <div>
          <label className="block text-xs uppercase tracking-wider text-crema/60 mb-1">
            Imagen
          </label>
          <input
            name="imagen"
            type="file"
            accept="image/*"
            required
            className="text-sm text-crema/80 file:mr-3 file:rounded file:border-0 file:bg-cuero file:text-crema file:px-3 file:py-1.5 file:cursor-pointer"
          />
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs uppercase tracking-wider text-crema/60 mb-1">
            Descripción (opcional)
          </label>
          <input
            name="alt"
            type="text"
            placeholder="Ej. Boda en el rancho al atardecer"
            className="w-full bg-[#0f0b08]/70 border border-cuero/50 focus:border-atardecer outline-none rounded px-3 py-2 text-sm text-crema transition-colors"
          />
        </div>
        <BotonSubmit
          className="bg-atardecer text-[#1a1410] hover:bg-cuero-claro"
          pendingText="Subiendo…"
        >
          Subir foto
        </BotonSubmit>
      </form>

      {/* Mosaico actual */}
      {items.length === 0 ? (
        <div className="card-rancho p-10 text-center text-crema/60">
          La galería está vacía. Sube tu primera foto arriba.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((g) => (
            <div
              key={g.id}
              className="relative group rounded-lg overflow-hidden border border-cuero/40 aspect-square"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.url}
                alt={g.alt ?? ""}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
