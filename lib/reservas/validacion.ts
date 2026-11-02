import { tiposDeEvento } from "@/lib/data";

/*
  Validación de una solicitud de reserva.

  Este módulo es deliberadamente puro: no importa "server-only" ni toca red ni
  base de datos. Lo usan los dos lados a la vez:

    - el navegador, para avisar al instante antes de pasar de paso
    - el servidor, como única verdad antes de guardar

  Tener una sola definición de las reglas evita el clásico desfase en el que el
  formulario acepta algo que el servidor rechaza (o, peor, al revés).
*/

export type DatosReserva = {
  nombre: string;
  telefono: string;
  email: string;
  tipoEvento: string;
  fechaEvento: string; // AAAA-MM-DD
  numCaballos: number;
  lugar: string;
  invitados: string;
  mensaje: string;
};

export type CampoReserva = keyof DatosReserva;
export type Errores = Partial<Record<CampoReserva, string>>;

export const MAX_CABALLOS = 20;
export const MAX_MENSAJE = 800;

/**
 * Nombre del campo trampa del formulario.
 *
 * Vive aquí, en el módulo compartido, porque lo necesitan los dos lados: el
 * formulario para pintarlo oculto y el servidor para comprobar que sigue
 * vacío. El nombre suena a algo que un robot querría rellenar.
 */
export const CAMPO_TRAMPA = "sitio_web";

/** Campos que se piden en cada paso del formulario. */
export const PASOS: { titulo: string; campos: CampoReserva[] }[] = [
  { titulo: "Tu evento", campos: ["tipoEvento", "fechaEvento", "numCaballos"] },
  { titulo: "Tus datos", campos: ["nombre", "telefono", "email"] },
  { titulo: "Detalles", campos: ["lugar", "invitados", "mensaje"] },
  { titulo: "Confirmar", campos: [] },
];

export const datosVacios: DatosReserva = {
  nombre: "",
  telefono: "",
  email: "",
  tipoEvento: tiposDeEvento[0],
  fechaEvento: "",
  numCaballos: 2,
  lugar: "",
  invitados: "",
  mensaje: "",
};

/** Deja solo los dígitos de un teléfono para poder contarlos y guardarlos. */
export function soloDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

/** Quita espacios de sobra y recorta. */
function limpiar(valor: string): string {
  return valor.replace(/\s+/g, " ").trim();
}

/** Detecta enlaces: casi todo el correo basura que llega por formulario trae uno. */
function tieneEnlace(texto: string): boolean {
  return /(https?:\/\/|www\.|\.[a-z]{2,}\/)/i.test(texto);
}

/** Fecha de hoy en formato AAAA-MM-DD. */
function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Resta un día a una fecha AAAA-MM-DD, con cuidado del cambio de mes. */
function diaAnterior(fecha: string): string {
  const d = new Date(`${fecha}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** Normaliza los datos tal y como se van a guardar. */
export function normalizar(d: DatosReserva): DatosReserva {
  return {
    nombre: limpiar(d.nombre),
    telefono: soloDigitos(d.telefono),
    email: limpiar(d.email).toLowerCase(),
    tipoEvento: d.tipoEvento,
    fechaEvento: d.fechaEvento,
    numCaballos: Math.trunc(Number(d.numCaballos) || 0),
    lugar: limpiar(d.lugar),
    invitados: soloDigitos(d.invitados),
    mensaje: d.mensaje.trim(),
  };
}

const validadores: Record<CampoReserva, (d: DatosReserva) => string | null> = {
  tipoEvento: (d) =>
    tiposDeEvento.includes(d.tipoEvento)
      ? null
      : "Elige uno de los tipos de evento de la lista.",

  fechaEvento: (d) => {
    if (!d.fechaEvento) return "Dinos la fecha de tu evento.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.fechaEvento))
      return "La fecha no tiene un formato válido.";
    if (Number.isNaN(Date.parse(`${d.fechaEvento}T00:00:00Z`)))
      return "Esa fecha no existe.";
    // Damos un día de margen: el servidor y quien rellena el formulario pueden
    // estar en husos distintos y no queremos rechazar el evento de "hoy".
    if (d.fechaEvento < diaAnterior(hoy()))
      return "La fecha ya pasó. Elige una fecha futura.";

    const dentroDeDosAnios = new Date();
    dentroDeDosAnios.setFullYear(dentroDeDosAnios.getFullYear() + 2);
    if (d.fechaEvento > dentroDeDosAnios.toISOString().slice(0, 10))
      return "Reservamos con hasta dos años de antelación.";

    return null;
  },

  numCaballos: (d) => {
    const n = Number(d.numCaballos);
    if (!Number.isInteger(n) || n < 1)
      return "Indica al menos un caballo.";
    if (n > MAX_CABALLOS)
      return `Para más de ${MAX_CABALLOS} caballos escríbenos directo por WhatsApp.`;
    return null;
  },

  nombre: (d) => {
    const nombre = limpiar(d.nombre);
    if (nombre.length < 3) return "Escribe tu nombre completo.";
    if (nombre.length > 80) return "Ese nombre es demasiado largo.";
    if (!/\p{L}{2,}/u.test(nombre)) return "Ese nombre no parece real.";
    if (tieneEnlace(nombre)) return "El nombre no puede llevar enlaces.";
    return null;
  },

  telefono: (d) => {
    const digitos = soloDigitos(d.telefono);
    if (!digitos) return "Necesitamos un teléfono para contactarte.";
    if (digitos.length < 10) return "El teléfono debe tener 10 dígitos.";
    if (digitos.length > 15) return "Ese teléfono tiene demasiados dígitos.";
    // Un número con un solo dígito repetido (0000000000) nunca es real.
    if (/^(\d)\1+$/.test(digitos)) return "Ese teléfono no parece real.";
    return null;
  },

  email: (d) => {
    const email = limpiar(d.email);
    if (!email) return null; // opcional
    if (email.length > 120) return "Ese correo es demasiado largo.";
    if (!/^[^\s@]+@[^\s@.]+\.[^\s@]{2,}$/.test(email))
      return "Revisa el correo, parece incompleto.";
    return null;
  },

  lugar: (d) =>
    limpiar(d.lugar).length > 140 ? "Resume un poco el lugar." : null,

  invitados: (d) => {
    const n = soloDigitos(d.invitados);
    if (!n) return null; // opcional
    if (n.length > 6) return "Ese número de invitados no parece real.";
    return null;
  },

  mensaje: (d) => {
    const mensaje = d.mensaje.trim();
    if (mensaje.length > MAX_MENSAJE)
      return `El mensaje no puede pasar de ${MAX_MENSAJE} caracteres.`;
    if (tieneEnlace(mensaje))
      return "Quita los enlaces del mensaje, por favor.";
    return null;
  },
};

/** Valida solo los campos de un paso. Devuelve {} si todo está bien. */
export function validarPaso(paso: number, datos: DatosReserva): Errores {
  const errores: Errores = {};
  for (const campo of PASOS[paso]?.campos ?? []) {
    const error = validadores[campo](datos);
    if (error) errores[campo] = error;
  }
  return errores;
}

/** Valida la solicitud completa. Es la comprobación que manda en el servidor. */
export function validarTodo(datos: DatosReserva): Errores {
  const errores: Errores = {};
  for (const campo of Object.keys(validadores) as CampoReserva[]) {
    const error = validadores[campo](datos);
    if (error) errores[campo] = error;
  }
  return errores;
}

export function hayErrores(errores: Errores): boolean {
  return Object.keys(errores).length > 0;
}
