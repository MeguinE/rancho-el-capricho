import { createClient } from "@supabase/supabase-js";

/*
  Cliente de Supabase para el navegador.
  Define las variables en .env.local (y en Vercel → Project Settings → Environment Variables):

    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...

  Si todavía no configuras Supabase, el formulario seguirá funcionando en
  "modo demo" (no se cae, solo no guarda en la base de datos).
*/
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Soporta el formato nuevo (publishable) y el antiguo (anon).
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigurado = Boolean(url && anonKey);

export const supabase = supabaseConfigurado
  ? createClient(url as string, anonKey as string)
  : null;
