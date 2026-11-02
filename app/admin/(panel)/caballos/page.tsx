import { getSupabaseAdmin, adminConfigurado } from "@/lib/supabaseAdmin";
import { guardarCaballoAction } from "@/app/admin/acciones";
import { BotonSubmit } from "@/components/admin/Botones";

export const dynamic = "force-dynamic";

type Caballo = {
  id: string;
  nombre: string;
  raza: string | null;
  temperamento: string | null;
  descripcion: string | null;
  img_url: string | null;
};

export default async function CaballosPage() {
  if (!adminConfigurado()) {
    return (
      <p className="text-crema/70">
        Configura{" "}
        <code className="text-atardecer">SUPABASE_SERVICE_ROLE_KEY</code> para
        editar los caballos.
      </p>
    );
  }

  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("caballos")
    .select("*")
    .order("orden", { ascending: true });
  const caballos = (data as Caballo[]) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-slab font-bold text-3xl text-crema">Caballos</h1>
        <p className="text-crema/60 mt-1">
          Edita el nombre, los datos y la foto de cada caballo. Al subir una
          foto nueva, la anterior se reemplaza.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {caballos.map((c) => (
          <form
            key={c.id}
            action={guardarCaballoAction}
            className="tarjeta p-5 flex gap-5"
          >
            <input type="hidden" name="id" value={c.id} />
            <input type="hidden" name="img_actual" value={c.img_url ?? ""} />

            {/* Foto */}
            <div className="shrink-0 w-28">
              <div className="aspect-[3/4] rounded-lg overflow-hidden border border-cuero/40 bg-[#0f0b08]/60 flex items-center justify-center">
                {c.img_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.img_url}
                    alt={c.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-cuero-claro text-2xl">🐴</span>
                )}
              </div>
              <label className="block text-[11px] uppercase tracking-wider text-crema/50 mt-2 mb-1">
                Cambiar foto
              </label>
              <input
                name="imagen"
                type="file"
                accept="image/*"
                className="w-full text-xs text-crema/70 file:mr-2 file:rounded file:border-0 file:bg-cuero file:text-crema file:px-2 file:py-1 file:cursor-pointer"
              />
            </div>

            {/* Datos */}
            <div className="flex-1 space-y-3">
              <Campo nombre="nombre" etiqueta="Nombre" valor={c.nombre} />
              <div className="grid grid-cols-2 gap-3">
                <Campo nombre="raza" etiqueta="Raza" valor={c.raza ?? ""} />
                <Campo
                  nombre="temperamento"
                  etiqueta="Temperamento"
                  valor={c.temperamento ?? ""}
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-crema/50 mb-1">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  rows={3}
                  defaultValue={c.descripcion ?? ""}
                  className="w-full bg-[#0f0b08]/70 border border-cuero/50 focus:border-atardecer outline-none rounded px-3 py-2 text-sm text-crema transition-colors"
                />
              </div>
              <BotonSubmit className="bg-atardecer text-[#1a1410] hover:bg-cuero-claro w-full">
                Guardar cambios
              </BotonSubmit>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}

function Campo({
  nombre,
  etiqueta,
  valor,
}: {
  nombre: string;
  etiqueta: string;
  valor: string;
}) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider text-crema/50 mb-1">
        {etiqueta}
      </label>
      <input
        name={nombre}
        type="text"
        defaultValue={valor}
        className="w-full bg-[#0f0b08]/70 border border-cuero/50 focus:border-atardecer outline-none rounded px-3 py-2 text-sm text-crema transition-colors"
      />
    </div>
  );
}
