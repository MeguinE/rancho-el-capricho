import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/*
  Cliente de Supabase con privilegios de administrador (service_role).
  ⚠️ SOLO se puede usar en el servidor. El import "server-only" hace que el
  build falle si por error se importa en un componente de cliente.

  Salta las reglas RLS, por eso lo usamos para:
    - leer las reservas (que el público no puede ver)
    - crear/editar/borrar caballos, galería y configuración
    - subir y borrar imágenes en Storage
*/
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Soporta el formato nuevo (secret) y el antiguo (service_role).
const serviceKey =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

export function adminConfigurado(): boolean {
  return Boolean(url && serviceKey);
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!url || !serviceKey) {
    throw new Error(
      "Falta configurar NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local"
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const BUCKET = "imagenes";
