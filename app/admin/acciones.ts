"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  abrirSesion,
  cerrarSesion,
  haySesion,
  passwordCorrecta,
  authConfigurado,
} from "@/lib/auth";
import { getSupabaseAdmin, adminConfigurado, BUCKET } from "@/lib/supabaseAdmin";

// ---------- Sesión ----------
export type EstadoLogin = { error?: string };

export async function loginAction(
  _prev: EstadoLogin,
  formData: FormData
): Promise<EstadoLogin> {
  if (!authConfigurado()) {
    return {
      error:
        "Falta configurar ADMIN_PASSWORD y ADMIN_SESSION_SECRET en el servidor.",
    };
  }
  const password = String(formData.get("password") || "");
  if (!passwordCorrecta(password)) {
    return { error: "Contraseña incorrecta." };
  }
  await abrirSesion();
  redirect("/admin");
}

export async function logoutAction() {
  await cerrarSesion();
  redirect("/admin/login");
}

// ---------- Utilidades internas ----------
async function exigirSesion() {
  if (!(await haySesion())) throw new Error("No autorizado");
  if (!adminConfigurado()) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY en el servidor para administrar datos."
    );
  }
}

function rutaPublicaDeUrl(url: string): string | null {
  // Devuelve la ruta dentro del bucket si la URL es de nuestro Storage
  const marca = `/storage/v1/object/public/${BUCKET}/`;
  const i = url.indexOf(marca);
  return i === -1 ? null : url.slice(i + marca.length);
}

async function subirImagen(file: File, prefijo: string): Promise<string> {
  if (!file || file.size === 0) throw new Error("No se recibió ninguna imagen.");
  if (!file.type.startsWith("image/"))
    throw new Error("El archivo debe ser una imagen.");
  if (file.size > 6 * 1024 * 1024)
    throw new Error("La imagen no debe pesar más de 6 MB.");

  const sb = getSupabaseAdmin();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const nombre = `${prefijo}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error } = await sb.storage.from(BUCKET).upload(nombre, bytes, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error("No se pudo subir la imagen: " + error.message);

  return sb.storage.from(BUCKET).getPublicUrl(nombre).data.publicUrl;
}

async function borrarImagenSiEsNuestra(url: string | null | undefined) {
  if (!url) return;
  const ruta = rutaPublicaDeUrl(url);
  if (!ruta) return; // es una URL externa (Unsplash) → no la tocamos
  try {
    await getSupabaseAdmin().storage.from(BUCKET).remove([ruta]);
  } catch {
    // si falla el borrado no interrumpimos la operación principal
  }
}

// ---------- Caballos ----------
export async function guardarCaballoAction(formData: FormData) {
  await exigirSesion();
  const sb = getSupabaseAdmin();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Falta el caballo a editar.");

  const datos: Record<string, unknown> = {
    nombre: String(formData.get("nombre") || "").trim(),
    raza: String(formData.get("raza") || "").trim(),
    temperamento: String(formData.get("temperamento") || "").trim(),
    descripcion: String(formData.get("descripcion") || "").trim(),
  };

  const file = formData.get("imagen") as File | null;
  if (file && file.size > 0) {
    const anterior = String(formData.get("img_actual") || "");
    datos.img_url = await subirImagen(file, "caballos");
    await borrarImagenSiEsNuestra(anterior);
  }

  const { error } = await sb.from("caballos").update(datos).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/caballos");
}

// ---------- Galería ----------
export async function agregarGaleriaAction(formData: FormData) {
  await exigirSesion();
  const sb = getSupabaseAdmin();
  const file = formData.get("imagen") as File | null;
  if (!file || file.size === 0) throw new Error("Elige una imagen.");

  const url = await subirImagen(file, "galeria");
  const alt = String(formData.get("alt") || "Foto del rancho").trim();

  const { data: max } = await sb
    .from("galeria")
    .select("orden")
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();
  const orden = (max?.orden ?? 0) + 1;

  const { error } = await sb.from("galeria").insert({ url, alt, orden });
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/galeria");
}

export async function eliminarGaleriaAction(formData: FormData) {
  await exigirSesion();
  const sb = getSupabaseAdmin();
  const id = String(formData.get("id") || "");
  const url = String(formData.get("url") || "");
  if (!id) throw new Error("Falta el elemento a borrar.");

  const { error } = await sb.from("galeria").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await borrarImagenSiEsNuestra(url);

  revalidatePath("/");
  revalidatePath("/admin/galeria");
}

// ---------- Logo ----------
export async function actualizarLogoAction(formData: FormData) {
  await exigirSesion();
  const sb = getSupabaseAdmin();
  const file = formData.get("imagen") as File | null;
  if (!file || file.size === 0) throw new Error("Elige una imagen para el logo.");

  // Logo anterior (para borrarlo del Storage)
  const { data: actual } = await sb
    .from("config")
    .select("valor")
    .eq("clave", "logo_url")
    .maybeSingle();

  const url = await subirImagen(file, "logo");

  const { error } = await sb
    .from("config")
    .upsert({ clave: "logo_url", valor: url }, { onConflict: "clave" });
  if (error) throw new Error(error.message);

  await borrarImagenSiEsNuestra(actual?.valor);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function quitarLogoAction() {
  await exigirSesion();
  const sb = getSupabaseAdmin();
  const { data: actual } = await sb
    .from("config")
    .select("valor")
    .eq("clave", "logo_url")
    .maybeSingle();

  await sb.from("config").delete().eq("clave", "logo_url");
  await borrarImagenSiEsNuestra(actual?.valor);

  revalidatePath("/");
  revalidatePath("/admin");
}

// ---------- Reservas ----------
export async function cambiarEstadoReservaAction(formData: FormData) {
  await exigirSesion();
  const sb = getSupabaseAdmin();
  const id = String(formData.get("id") || "");
  const estado = String(formData.get("estado") || "nueva");
  if (!id) throw new Error("Falta la reserva.");

  const { error } = await sb.from("reservas").update({ estado }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/reservas");
}

export async function eliminarReservaAction(formData: FormData) {
  await exigirSesion();
  const sb = getSupabaseAdmin();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Falta la reserva.");

  const { error } = await sb.from("reservas").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/reservas");
}
