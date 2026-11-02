import Image from "next/image";
import { getSupabaseAdmin, adminConfigurado } from "@/lib/supabaseAdmin";
import { guardarCaballoAction } from "@/app/admin/acciones";
import { BotonSubmit } from "@/components/admin/Botones";
import CampoAdmin from "@/components/admin/CampoAdmin";
import AvisoFalta from "@/components/admin/AvisoFalta";

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
    return <AvisoFalta accion="editar los caballos" />;
  }

  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("caballos")
    .select("*")
    .order("orden", { ascending: true });
  const caballos = (data as Caballo[]) ?? [];

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-slab font-bold text-3xl text-crema">Caballos</h1>
        <p className="text-crema/60 mt-1.5">
          Edita el nombre, los datos y la foto de cada caballo. Al subir una
          foto nueva, la anterior se borra del almacenamiento.
        </p>
      </div>

      {caballos.length === 0 ? (
        <div className="tarjeta p-10 text-center text-crema/60">
          No hay caballos todavía. Ejecuta{" "}
          <code className="text-atardecer">supabase/schema.sql</code> para
          cargar los iniciales.
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {caballos.map((c) => (
            <form
              key={c.id}
              action={guardarCaballoAction}
              className="tarjeta p-5 flex gap-5"
            >
              <input type="hidden" name="id" value={c.id} />
              <input type="hidden" name="img_actual" value={c.img_url ?? ""} />

              <div className="shrink-0 w-28">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-cuero/40 bg-carbon/60 grid place-items-center">
                  {c.img_url ? (
                    <Image
                      src={c.img_url}
                      alt={c.nombre}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-cuero-claro text-2xl" aria-hidden="true">
                      🐴
                    </span>
                  )}
                </div>

                <label
                  htmlFor={`imagen-${c.id}`}
                  className="etiqueta-campo text-[0.64rem] mt-2.5"
                >
                  Cambiar foto
                </label>
                <input
                  id={`imagen-${c.id}`}
                  name="imagen"
                  type="file"
                  accept="image/*"
                  className="campo-archivo text-[0.7rem]"
                />
              </div>

              <div className="flex-1 space-y-3 min-w-0">
                <CampoAdmin
                  nombre="nombre"
                  etiqueta="Nombre"
                  valor={c.nombre}
                  sufijo={c.id}
                />
                <div className="grid grid-cols-2 gap-3">
                  <CampoAdmin
                    nombre="raza"
                    etiqueta="Raza"
                    valor={c.raza ?? ""}
                    sufijo={c.id}
                  />
                  <CampoAdmin
                    nombre="temperamento"
                    etiqueta="Temperamento"
                    valor={c.temperamento ?? ""}
                    sufijo={c.id}
                  />
                </div>
                <CampoAdmin
                  nombre="descripcion"
                  etiqueta="Descripción"
                  valor={c.descripcion ?? ""}
                  sufijo={c.id}
                  filas={3}
                />
                <BotonSubmit className="bg-atardecer text-madera hover:bg-cuero-claro w-full">
                  Guardar cambios
                </BotonSubmit>
              </div>
            </form>
          ))}
        </div>
      )}
    </div>
  );
}
