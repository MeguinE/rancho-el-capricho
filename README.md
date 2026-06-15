# 🤠 Rancho el Capricho

Landing page para la renta de caballos para eventos sociales (bodas, XV años,
cabalgatas, sesiones de fotos). Hecha con **Next.js + Tailwind CSS**, conectada a
**Supabase** (reservas, base de datos y almacenamiento de imágenes) e incluye un
**panel de administración** en `/admin`.

---

## 🚀 Correr en tu computadora

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

> Sin configurar Supabase, el sitio se ve completo con contenido por defecto y el
> formulario funciona en **modo demo** (no guarda nada). Conéctalo para recibir
> reservas y poder editar desde el panel.

---

## 🗄️ Conectar Supabase

1. Crea un proyecto gratis en [supabase.com](https://supabase.com).
2. Ve a **SQL Editor → New query**, pega TODO el contenido de
   [`supabase/schema.sql`](supabase/schema.sql) y dale **Run**.
   Esto crea las tablas (`reservas`, `caballos`, `galeria`, `config`), carga el
   contenido inicial y crea el bucket de imágenes `imagenes`.
3. Ve a **Project Settings → API** y copia: `Project URL`, la clave
   `anon public` y la clave `service_role` (secreta).
4. Copia `.env.local.example` a **`.env.local`** y rellena los valores:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-publica
   SUPABASE_SERVICE_ROLE_KEY=tu-clave-service-role
   ADMIN_PASSWORD=la-contraseña-de-tu-panel
   ADMIN_SESSION_SECRET=cadena-larga-y-aleatoria
   ```
   Genera el `ADMIN_SESSION_SECRET` con:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
5. Reinicia `npm run dev`.

> ⚠️ La clave `service_role` y `ADMIN_PASSWORD` son **secretas**: nunca las subas
> a git ni las compartas. El archivo `.env.local` ya está ignorado.

---

## 🔐 Panel de administración (`/admin`)

Entra en [http://localhost:3000/admin](http://localhost:3000/admin) con la
contraseña que pusiste en `ADMIN_PASSWORD`. Desde ahí puedes:

- **Reservas** — ver las solicitudes del formulario, marcarlas como
  *contactada* / *cerrada*, escribir por WhatsApp/correo y eliminarlas.
- **Caballos** — editar nombre, raza, temperamento, descripción y **foto** de
  cada caballo.
- **Galería** — subir y eliminar las fotos del mosaico de eventos.
- **Logo** — subir el logo del sitio (o quitarlo para usar el por defecto).

Al reemplazar una foto, la anterior se borra del Storage automáticamente para no
acumular archivos.

### ¿Qué es editable y qué no?

Editable desde el panel: **reservas, caballos, galería y logo**. El resto del
contenido (hero, servicios, testimonios, textos, datos de contacto) está en
[`lib/data.ts`](lib/data.ts) y se cambia ahí.

---

## ☁️ Desplegar en Vercel

1. Sube el proyecto a un repositorio de GitHub.
2. Entra a [vercel.com](https://vercel.com) → **Add New → Project** e importa el repo.
3. En **Environment Variables** agrega las **cinco** variables del `.env.local`
   (las dos `NEXT_PUBLIC_*`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD` y
   `ADMIN_SESSION_SECRET`).
4. **Deploy**. Vercel detecta Next.js automáticamente.

---

## 📁 Estructura

```
app/
  page.tsx                  Landing (lee caballos/galería/logo de Supabase)
  layout.tsx                Fuentes y metadatos
  globals.css               Paleta y estilos western + animaciones
  admin/
    login/page.tsx          Acceso con contraseña
    acciones.ts             Server Actions (login, CRUD, subida de imágenes)
    (panel)/                Panel protegido: inicio, reservas, caballos, galería
components/
  Navbar, Marquee, Polvo, Contador, Reveal, Icono, FotoPlaceholder, FormReserva
  admin/                    Navegación y botones del panel
lib/
  data.ts                   Contenido por defecto / no editable desde el panel
  supabase.ts               Cliente público (navegador)
  supabaseAdmin.ts          Cliente service_role (solo servidor)
  contenido.ts              Lee contenido editable con respaldo a data.ts
  auth.ts                   Sesión del admin (cookie firmada)
supabase/
  schema.sql                Script para crear toda la base de datos
```
