"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin, adminConfigurado } from "@/lib/supabaseAdmin";
import {
  antispamConfigurado,
  crearToken,
  elegirPregunta,
  huellaDeIp,
  LIMITE_POR_HORA,
  mensajeDeRechazo,
  revisarEnvio,
  type PreguntaPublica,
} from "@/lib/reservas/antispam";
import {
  hayErrores,
  normalizar,
  validarTodo,
  type DatosReserva,
  type Errores,
} from "@/lib/reservas/validacion";

/*
  Alta de reservas.

  La solicitud se guarda desde el servidor con la clave de servicio, no desde
  el navegador con la clave pública. Ese cambio es el que de verdad cierra la
  puerta: la tabla `reservas` ya no acepta escrituras anónimas (ver
  supabase/schema.sql), así que la única vía de entrada es esta acción, que
  valida, revisa las defensas antispam y limita el ritmo de envíos.
*/

export type EstadoReserva =
  | { fase: "inicial" }
  | { fase: "ok"; demo: boolean }
  | { fase: "error"; mensaje: string; errores: Errores };

export const estadoInicial: EstadoReserva = { fase: "inicial" };

export type InicioSolicitud = {
  /** Token firmado que acompaña al envío. Vacío en modo demostración. */
  token: string;
  pregunta: PreguntaPublica;
  /** true cuando Supabase no está configurado y no se guarda nada. */
  demo: boolean;
};

/**
 * Prepara una solicitud: emite el token y elige la pregunta de verificación.
 *
 * Se llama al abrir el formulario, no al enviarlo. El momento en que se emite
 * el token queda firmado dentro, y eso es lo que nos permite exigir después un
 * tiempo mínimo de relleno sin guardar nada en el servidor.
 */
export async function iniciarSolicitudAction(): Promise<InicioSolicitud> {
  const { indice, publica } = elegirPregunta();
  const demo = !adminConfigurado();

  // Sin secreto no podemos firmar. Solo es aceptable en modo demostración,
  // donde no se guarda nada; con Supabase conectado es un error de configuración
  // y se avisa al enviar.
  const token = antispamConfigurado() ? crearToken(indice) : "";

  return { token, pregunta: publica, demo };
}

/** Lee el formulario a la forma con la que trabaja el validador. */
function leerFormulario(formData: FormData): DatosReserva {
  const texto = (campo: string) => String(formData.get(campo) ?? "");
  return {
    nombre: texto("nombre"),
    telefono: texto("telefono"),
    email: texto("email"),
    tipoEvento: texto("tipoEvento"),
    fechaEvento: texto("fechaEvento"),
    numCaballos: Number(formData.get("numCaballos") ?? 0),
    lugar: texto("lugar"),
    invitados: texto("invitados"),
    mensaje: texto("mensaje"),
  };
}

/** IP del visitante según las cabeceras del proxy (Vercel, nginx…). */
async function ipDelVisitante(): Promise<string> {
  const h = await headers();
  const reenviada = h.get("x-forwarded-for");
  // `x-forwarded-for` puede traer una cadena de proxies: el primero es el cliente.
  if (reenviada) return reenviada.split(",")[0].trim();
  return h.get("x-real-ip") ?? "";
}

function fallo(mensaje: string, errores: Errores = {}): EstadoReserva {
  return { fase: "error", mensaje, errores };
}

export async function enviarReservaAction(
  _previo: EstadoReserva,
  formData: FormData
): Promise<EstadoReserva> {
  const datos = normalizar(leerFormulario(formData));

  // 1. Las reglas de negocio mandan, y se vuelven a aplicar aquí aunque el
  //    navegador ya las haya comprobado.
  const errores = validarTodo(datos);
  if (hayErrores(errores)) {
    return fallo("Revisa los campos marcados.", errores);
  }

  // 2. Sin Supabase el sitio sigue siendo navegable y el formulario responde,
  //    pero no se guarda nada. Es el modo con el que arranca el proyecto.
  if (!adminConfigurado()) {
    return { fase: "ok", demo: true };
  }

  if (!antispamConfigurado()) {
    return fallo(
      "El formulario no está configurado en el servidor. Falta RESERVA_SECRET o ADMIN_SESSION_SECRET."
    );
  }

  // 3. Defensas que no necesitan base de datos: firma, tiempo mínimo, campo
  //    trampa y pregunta de verificación.
  const rechazo = revisarEnvio(formData);
  if (rechazo) return fallo(mensajeDeRechazo(rechazo));

  const sb = getSupabaseAdmin();
  const ipHash = huellaDeIp(await ipDelVisitante());

  try {
    // 4. Tope de solicitudes por IP y hora.
    const haceUnaHora = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: recientes } = await sb
      .from("reservas")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("creado_en", haceUnaHora);

    if ((recientes ?? 0) >= LIMITE_POR_HORA) {
      return fallo(
        "Ya recibimos varias solicitudes tuyas. Escríbenos por WhatsApp y lo vemos al momento."
      );
    }

    // 5. Misma persona y misma fecha en el último día: es un reenvío, no una
    //    solicitud nueva. Lo contamos como enviado para no confundir a nadie.
    const haceUnDia = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: repetidas } = await sb
      .from("reservas")
      .select("id", { count: "exact", head: true })
      .eq("telefono", datos.telefono)
      .eq("fecha_evento", datos.fechaEvento)
      .gte("creado_en", haceUnDia);

    if ((repetidas ?? 0) > 0) {
      return { fase: "ok", demo: false };
    }

    const { error } = await sb.from("reservas").insert({
      nombre: datos.nombre,
      telefono: datos.telefono,
      email: datos.email || null,
      tipo_evento: datos.tipoEvento,
      fecha_evento: datos.fechaEvento,
      num_caballos: datos.numCaballos,
      lugar: datos.lugar || null,
      invitados: datos.invitados ? Number(datos.invitados) : null,
      mensaje: datos.mensaje || null,
      ip_hash: ipHash,
    });

    if (error) throw new Error(error.message);
  } catch (e) {
    // El detalle se queda en el servidor: al visitante no le sirve y puede
    // decir más de la cuenta sobre la base de datos.
    console.error("[reservas] no se pudo guardar la solicitud:", e);
    return fallo(
      "No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp."
    );
  }

  revalidatePath("/admin/reservas");
  revalidatePath("/admin");

  return { fase: "ok", demo: false };
}
