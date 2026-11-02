import Seccion from "@/components/Seccion";
import TituloSeccion from "@/components/TituloSeccion";
import InvitacionReserva from "@/components/reserva/InvitacionReserva";

/** Llamada final: invitación a reservar y vías de contacto directo. */
export default function Reservar() {
  return (
    <Seccion id="reservar" fondo="noche" ancho="estrecho" aire="suelto">
      <TituloSeccion
        antetitulo="¿Listo para tu evento?"
        titulo="Reserva tus Caballos"
        descripcion="Cuéntanos qué celebras y armamos una propuesta a tu medida."
        className="mb-12"
      />
      <InvitacionReserva />
    </Seccion>
  );
}
