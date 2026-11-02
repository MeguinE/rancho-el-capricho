import "server-only";
import crypto from "node:crypto";
import { CAMPO_TRAMPA } from "@/lib/reservas/validacion";

/*
  Defensas del formulario de reserva.

  El objetivo no es frenar a un atacante decidido, sino que no lleguen al panel
  ni bots automáticos ni "registros de broma" de quien pasa por la página y
  pulsa enviar por curiosidad. Son varias capas pequeñas, cada una barata:

    1. Token firmado      → la solicitud viene de nuestro formulario, no de un
                            script que hace POST a ciegas.
    2. Tiempo mínimo      → un bot rellena y envía en milisegundos.
    3. Campo trampa       → invisible para una persona, irresistible para un
                            robot que rellena todo lo que encuentra.
    4. Pregunta de vaquero→ un clic con sentido, sin depender de un captcha
                            externo ni de cookies de terceros.
    5. Límite por IP      → tope de solicitudes por hora.
    6. Duplicados        → misma persona y misma fecha dos veces seguidas.

  Nada de esto sustituye a la validación: eso vive en lib/reservas/validacion.
*/

/** Milisegundos que, como mínimo, debe tardar una persona en rellenar. */
export const ESPERA_MINIMA = 6_000;
/** Caducidad del token del formulario. */
export const VIDA_TOKEN = 2 * 60 * 60 * 1000;
/** Solicitudes permitidas por IP en una hora. */
export const LIMITE_POR_HORA = 3;

function secreto(): string {
  const s = process.env.RESERVA_SECRET ?? process.env.ADMIN_SESSION_SECRET;
  if (!s) {
    throw new Error(
      "Falta RESERVA_SECRET (o ADMIN_SESSION_SECRET) para firmar el formulario."
    );
  }
  return s;
}

export function antispamConfigurado(): boolean {
  return Boolean(process.env.RESERVA_SECRET ?? process.env.ADMIN_SESSION_SECRET);
}

// ───────────────────────── Pregunta de vaquero ─────────────────────────

/**
 * Preguntas de sentido común con sabor ranchero.
 *
 * La respuesta correcta nunca sale del servidor: al navegador solo le damos el
 * texto y las opciones, y el índice de la pregunta va firmado dentro del token.
 */
const PREGUNTAS = [
  {
    texto: "¿Cuántas patas tiene un caballo?",
    opciones: ["Dos", "Cuatro", "Seis"],
    correcta: 1,
  },
  {
    texto: "¿Qué lleva un caballo en los cascos?",
    opciones: ["Un sombrero", "Una herradura", "Una espuela"],
    correcta: 1,
  },
  {
    texto: "¿Cuál de estos NO es un caballo?",
    opciones: ["Yegua", "Potro", "Borrego"],
    correcta: 2,
  },
  {
    texto: "¿Sobre qué se monta para cabalgar?",
    opciones: ["Una silla", "Una mesa", "Una escalera"],
    correcta: 0,
  },
  {
    texto: "¿Qué come un caballo?",
    opciones: ["Tornillos", "Alfalfa", "Ladrillos"],
    correcta: 1,
  },
] as const;

export type PreguntaPublica = {
  texto: string;
  opciones: readonly string[];
};

export function elegirPregunta(): { indice: number; publica: PreguntaPublica } {
  const indice = crypto.randomInt(PREGUNTAS.length);
  const { texto, opciones } = PREGUNTAS[indice];
  return { indice, publica: { texto, opciones } };
}

export function preguntaPorIndice(indice: number): PreguntaPublica | null {
  const p = PREGUNTAS[indice];
  return p ? { texto: p.texto, opciones: p.opciones } : null;
}

function respuestaCorrecta(indicePregunta: number, respuesta: number): boolean {
  return PREGUNTAS[indicePregunta]?.correcta === respuesta;
}

// ───────────────────────── Token firmado ─────────────────────────

type Contenido = { emitido: number; pregunta: number };

export function crearToken(pregunta: number): string {
  const contenido: Contenido = { emitido: Date.now(), pregunta };
  const cuerpo = Buffer.from(JSON.stringify(contenido)).toString("base64url");
  return `${cuerpo}.${firmar(cuerpo)}`;
}

function firmar(cuerpo: string): string {
  return crypto
    .createHmac("sha256", secreto())
    .update(cuerpo)
    .digest("base64url");
}

type Revision =
  | { ok: true; contenido: Contenido }
  | { ok: false; motivo: string };

/** Comprueba firma, caducidad y tiempo mínimo de relleno. */
export function revisarToken(token: string): Revision {
  const [cuerpo, firma] = token.split(".");
  if (!cuerpo || !firma) return { ok: false, motivo: "formulario_invalido" };

  const esperada = firmar(cuerpo);
  const a = Buffer.from(firma);
  const b = Buffer.from(esperada);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, motivo: "formulario_invalido" };
  }

  let contenido: Contenido;
  try {
    contenido = JSON.parse(Buffer.from(cuerpo, "base64url").toString());
  } catch {
    return { ok: false, motivo: "formulario_invalido" };
  }

  const edad = Date.now() - contenido.emitido;
  if (edad > VIDA_TOKEN) return { ok: false, motivo: "caducado" };
  if (edad < ESPERA_MINIMA) return { ok: false, motivo: "demasiado_rapido" };

  return { ok: true, contenido };
}

// ───────────────────────── Revisión completa ─────────────────────────

export type MotivoRechazo =
  | "formulario_invalido"
  | "caducado"
  | "demasiado_rapido"
  | "trampa"
  | "respuesta_incorrecta";

/**
 * Pasa todas las comprobaciones que no necesitan base de datos.
 *
 * Devuelve `null` si la solicitud parece legítima, o el motivo del rechazo.
 */
export function revisarEnvio(formData: FormData): MotivoRechazo | null {
  // El campo trampa está oculto para las personas: si viene relleno, es un bot.
  if (String(formData.get(CAMPO_TRAMPA) ?? "").trim() !== "") return "trampa";

  const revision = revisarToken(String(formData.get("token") ?? ""));
  if (!revision.ok) return revision.motivo as MotivoRechazo;

  const respuesta = Number(formData.get("respuesta"));
  if (!Number.isInteger(respuesta)) return "respuesta_incorrecta";
  if (!respuestaCorrecta(revision.contenido.pregunta, respuesta)) {
    return "respuesta_incorrecta";
  }

  return null;
}

/** Mensaje que ve el visitante. No revela qué defensa saltó. */
export function mensajeDeRechazo(motivo: MotivoRechazo): string {
  switch (motivo) {
    case "respuesta_incorrecta":
      return "La respuesta de la verificación no es correcta. Inténtalo otra vez.";
    case "demasiado_rapido":
      return "Tómate un momento para revisar los datos y vuelve a enviar.";
    case "caducado":
      return "El formulario caducó. Ciérralo y vuelve a abrirlo, por favor.";
    default:
      return "No pudimos validar el formulario. Recarga la página e inténtalo de nuevo.";
  }
}

// ───────────────────────── Huella de la IP ─────────────────────────

/**
 * Convierte una IP en una huella estable pero irreversible.
 *
 * Guardamos el hash y no la IP: nos sirve igual para contar envíos y limitar
 * abusos, y así no almacenamos un dato personal que no necesitamos.
 */
export function huellaDeIp(ip: string): string {
  return crypto
    .createHmac("sha256", secreto())
    .update(ip || "desconocida")
    .digest("hex")
    .slice(0, 32);
}
