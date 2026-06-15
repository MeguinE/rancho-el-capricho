import "server-only";
import { createClient } from "@supabase/supabase-js";
import {
  caballos as caballosDefault,
  galeria as galeriaDefault,
  type Caballo,
} from "@/lib/data";

/*
  Lee el contenido editable del sitio (caballos, galería, logo) desde Supabase.
  Si Supabase todavía no está configurado o una tabla está vacía, devuelve los
  valores por defecto de lib/data.ts para que la web nunca se vea vacía.

  Se usa desde Server Components (la home), con la clave pública (anon) y
  respetando las reglas de lectura pública (RLS).
*/

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function cliente() {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

export type ItemGaleria = { img: string; alt: string; span?: string };

// Devuelve el patrón de mosaico para que la galería conserve su diseño
function spanPorIndice(i: number): string | undefined {
  if (i % 7 === 0) return "ancho";
  if (i % 7 === 3) return "alto";
  return undefined;
}

export async function obtenerCaballos(): Promise<Caballo[]> {
  const sb = cliente();
  if (!sb) return caballosDefault;
  const { data, error } = await sb
    .from("caballos")
    .select("nombre, raza, temperamento, descripcion, img_url")
    .order("orden", { ascending: true });
  if (error || !data || data.length === 0) return caballosDefault;
  return data.map((c) => ({
    nombre: c.nombre,
    raza: c.raza ?? "",
    temperamento: c.temperamento ?? "",
    descripcion: c.descripcion ?? "",
    img: c.img_url ?? "",
  }));
}

export async function obtenerGaleria(): Promise<ItemGaleria[]> {
  const sb = cliente();
  if (!sb) return galeriaDefault;
  const { data, error } = await sb
    .from("galeria")
    .select("url, alt")
    .order("orden", { ascending: true });
  if (error || !data || data.length === 0) return galeriaDefault;
  return data.map((g, i) => ({
    img: g.url,
    alt: g.alt ?? `Foto ${i + 1}`,
    span: spanPorIndice(i),
  }));
}

export async function obtenerLogo(): Promise<string | null> {
  const sb = cliente();
  if (!sb) return null;
  const { data, error } = await sb
    .from("config")
    .select("valor")
    .eq("clave", "logo_url")
    .maybeSingle();
  if (error || !data?.valor) return null;
  return data.valor;
}
