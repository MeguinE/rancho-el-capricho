# 🤠 Rancho el Capricho

Landing page para la renta de caballos para eventos sociales (bodas, XV años,
cabalgatas, sesiones de fotos). Hecha con **Next.js + Tailwind CSS** y conectada
a **Supabase** para recibir las solicitudes de reserva.

---

## 🚀 Correr en tu computadora

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

> Sin configurar Supabase el formulario funciona en **modo demo** (no guarda nada,
> solo simula el envío). Conéctalo cuando quieras recibir reservas de verdad.

---

## 🖼️ Cómo agregar tus fotos

1. Guarda tus imágenes dentro de la carpeta **`public/img/`**
   (ej. `public/img/relampago.jpg`).
2. **Caballos:** abre [`lib/data.ts`](lib/data.ts) y en cada caballo escribe la
   ruta en `img`, por ejemplo:
   ```ts
   { nombre: "Relámpago", raza: "Azteca", descripcion: "...", img: "/img/relampago.jpg" }
   ```
3. **Galería y foto del rancho:** en [`app/page.tsx`](app/page.tsx) busca los
   `<FotoPlaceholder ... />` y agrégales la prop `src="/img/tu-foto.jpg"`.
4. **Hero (portada):** edita la sección `HERO` en `app/page.tsx`.

Mientras no pongas una foto, se muestra un marco placeholder con 🐴.

También puedes cambiar textos, nombres de caballos, servicios y datos de
contacto (teléfono, WhatsApp, redes) en [`lib/data.ts`](lib/data.ts).

---

## 🗄️ Conectar Supabase (back-end y base de datos)

1. Crea un proyecto gratis en [supabase.com](https://supabase.com).
2. Ve a **SQL Editor → New query**, pega el contenido de
   [`supabase/schema.sql`](supabase/schema.sql) y dale **Run**.
   Esto crea la tabla `reservas` con la seguridad correcta.
3. Ve a **Project Settings → API** y copia:
   - `Project URL`
   - `anon public` key
4. En la raíz del proyecto crea un archivo **`.env.local`** (puedes copiar
   `.env.local.example`) con:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-publica
   ```
5. Reinicia `npm run dev`. ¡Listo! Las reservas llegarán a la tabla `reservas`,
   que puedes ver en Supabase → **Table Editor**.

---

## ☁️ Desplegar en Vercel

1. Sube el proyecto a un repositorio de GitHub.
2. Entra a [vercel.com](https://vercel.com) → **Add New → Project** e importa el repo.
3. En **Environment Variables** agrega las dos variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy**. Vercel detecta Next.js automáticamente.

---

## 📁 Estructura

```
app/
  layout.tsx          Fuentes (Rye, Special Elite, Oswald) y metadatos
  page.tsx            La landing completa por secciones
  globals.css         Paleta de colores y estilos western
components/
  Navbar.tsx          Menú fijo y responsivo
  FotoPlaceholder.tsx Marco de foto / placeholder
  FormReserva.tsx     Formulario que guarda en Supabase
lib/
  data.ts             Contenido editable (caballos, servicios, contacto)
  supabase.ts         Cliente de Supabase
supabase/
  schema.sql          Script para crear la base de datos
```
