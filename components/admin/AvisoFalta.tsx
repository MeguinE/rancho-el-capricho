/**
 * Aviso de que falta la clave de servicio.
 *
 * Las tres pantallas del panel necesitan la misma advertencia; tenerla en un
 * sitio evita que el texto se vaya separando con el tiempo.
 */
export default function AvisoFalta({ accion }: { accion: string }) {
  return (
    <div className="tarjeta p-7">
      <h1 className="font-slab font-bold text-2xl text-crema">Casi listo</h1>
      <p className="text-crema/70 mt-3 leading-relaxed">
        Falta configurar{" "}
        <code className="text-atardecer">SUPABASE_SERVICE_ROLE_KEY</code> en el
        servidor (y en Vercel) para {accion}. Tienes la lista completa de
        variables en <code className="text-atardecer">.env.local.example</code>.
      </p>
    </div>
  );
}
