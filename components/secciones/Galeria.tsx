import Seccion from "@/components/Seccion";
import TituloSeccion from "@/components/TituloSeccion";
import MosaicoGaleria from "@/components/galeria/MosaicoGaleria";
import type { ItemGaleria } from "@/lib/contenido";

/**
 * Sección de galería.
 *
 * La cabecera se queda en el servidor y solo el mosaico, que necesita estado
 * para el visor, viaja al navegador.
 */
export default function Galeria({ fotos }: { fotos: ItemGaleria[] }) {
  return (
    <Seccion id="galeria" fondo="noche">
      <TituloSeccion
        antetitulo="Momentos en el rancho"
        titulo="Galería"
        descripcion="Bodas, cabalgatas y sesiones de foto. Toca cualquier imagen para verla en grande."
        className="mb-14"
      />
      <MosaicoGaleria fotos={fotos} />
    </Seccion>
  );
}
