import "server-only";
import { cookies } from "next/headers";
import crypto from "node:crypto";

/*
  Autenticación sencilla del panel de admin con UNA contraseña.
  - La contraseña vive en la variable de entorno ADMIN_PASSWORD.
  - Al iniciar sesión guardamos una cookie httpOnly firmada con HMAC
    (ADMIN_SESSION_SECRET) y con caducidad. No guardamos la contraseña.
*/

const COOKIE = "rancho_admin";
const DIAS_VALIDA = 7;

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("Falta ADMIN_SESSION_SECRET en .env.local");
  return s;
}

export function authConfigurado(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

/** Compara la contraseña recibida con la configurada (a prueba de timing). */
export function passwordCorrecta(intento: string): boolean {
  const real = process.env.ADMIN_PASSWORD ?? "";
  const a = Buffer.from(intento);
  const b = Buffer.from(real);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function firmar(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

function crearToken(): string {
  const exp = Date.now() + DIAS_VALIDA * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  return `${payload}.${firmar(payload)}`;
}

function tokenValido(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, firma] = token.split(".");
  if (!payload || !firma) return false;
  // Firma correcta
  const esperada = firmar(payload);
  const fa = Buffer.from(firma);
  const fb = Buffer.from(esperada);
  if (fa.length !== fb.length || !crypto.timingSafeEqual(fa, fb)) return false;
  // No caducada
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

/** Crea la cookie de sesión (llamar dentro de una Server Action / route). */
export async function abrirSesion() {
  const store = await cookies();
  store.set(COOKIE, crearToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DIAS_VALIDA * 24 * 60 * 60,
  });
}

/** Borra la cookie de sesión. */
export async function cerrarSesion() {
  const store = await cookies();
  store.delete(COOKIE);
}

/** Devuelve true si la petición actual tiene una sesión válida. */
export async function haySesion(): Promise<boolean> {
  const store = await cookies();
  return tokenValido(store.get(COOKIE)?.value);
}
