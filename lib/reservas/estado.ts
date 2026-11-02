import type { Errores } from "@/lib/reservas/validacion";

/*
  Tipos y constantes que se reparten entre el formulario y la Server Action.

  Viven aquí y no junto a la acción por una regla de Next: un archivo con
  "use server" solo puede exportar funciones async, porque cada export se
  convierte en una referencia que el cliente puede invocar. Exportar desde ahí
  un objeto como `estadoInicial` hace que el módulo entero falle al cargarse.
*/

/** Pregunta de verificación tal y como la ve el navegador, sin la respuesta. */
export type PreguntaPublica = {
  texto: string;
  opciones: readonly string[];
};

/** Lo que devuelve la acción que prepara una solicitud. */
export type InicioSolicitud = {
  /** Token firmado que acompaña al envío. Vacío en modo demostración. */
  token: string;
  pregunta: PreguntaPublica;
  /** true cuando Supabase no está configurado y no se guarda nada. */
  demo: boolean;
};

/** Resultado de intentar enviar la solicitud. */
export type EstadoReserva =
  | { fase: "inicial" }
  | { fase: "ok"; demo: boolean }
  | { fase: "error"; mensaje: string; errores: Errores };

export const estadoInicial: EstadoReserva = { fase: "inicial" };
