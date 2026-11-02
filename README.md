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

Otros comandos:

```bash
npm run build      # compila para producción
npm run typecheck  # revisa los tipos sin compilar
```

> Sin configurar Supabase, el sitio se ve completo con contenido por defecto y
> el formulario funciona en **modo demostración** (no guarda nada). Conéctalo
> para recibir reservas y poder editar desde el panel.

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

> **Si ya habías ejecutado una versión anterior del esquema**, vuelve a
> ejecutarlo completo. Es seguro (usa `if not exists` / `on conflict`) y aplica
> dos cambios necesarios: añade las columnas nuevas de `reservas` y **retira el
> permiso de escritura anónima** de esa tabla.

---

## 📨 Cómo llegan las reservas (y por qué no entra basura)

El formulario **no está suelto en la página**: la sección de reserva muestra una
invitación y la solicitud se abre en una ventana aparte, en cuatro pasos, con
una pantalla de confirmación antes de enviar. La fricción es intencional: así
solo termina el formulario quien de verdad quiere reservar.

Por debajo, **el navegador ya no escribe en la base de datos**. La solicitud la
guarda el servidor desde [`app/acciones/reservas.ts`](app/acciones/reservas.ts)
con la clave de servicio, y la tabla `reservas` no acepta escrituras anónimas.
Esa es la puerta única, y antes de guardar comprueba:

| Capa | Qué hace |
| --- | --- |
| Validación | Reglas en un módulo puro que usan el navegador y el servidor. Una sola definición, sin desfases. |
| Token firmado | HMAC con el momento de emisión dentro: obliga a tardar al menos 6 s y caduca a las 2 h. |
| Campo trampa | Invisible y fuera del recorrido del teclado. Si viene relleno, es un robot. |
| Verificación de vaquero | Una pregunta de sentido común ("¿cuántas patas tiene un caballo?"). Sin captcha de terceros ni cookies externas. |
| Límite por IP | Máximo 3 solicitudes por hora, contadas en la propia tabla. |
| Duplicados | Mismo teléfono y misma fecha en 24 h se acepta sin crear otra fila. |

De la IP solo se guarda una huella HMAC, nunca la IP.

**Variables opcionales**: `RESERVA_SECRET` (si prefieres que el formulario no
comparta secreto con la sesión del panel) y `NEXT_PUBLIC_SITE_URL` (para el
sitemap y las vistas previas al compartir el enlace).

---

## 🔐 Panel de administración (`/admin`)

Entra en [http://localhost:3000/admin](http://localhost:3000/admin) con la
contraseña que pusiste en `ADMIN_PASSWORD`. Desde ahí puedes:

- **Reservas** — ver las solicitudes, filtrarlas por estado, marcarlas como
  *contactada* / *cerrada*, escribir por WhatsApp o correo y eliminarlas.
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

## 🎨 Cómo está hecha la interfaz

[`app/globals.css`](app/globals.css) es un sistema de diseño en tres capas:
**tokens** (color, tipografías, curvas de animación, sombras), **base** (reglas
globales, foco, accesibilidad) y **componentes** (botones, tarjetas, campos,
cintas). Los componentes viven en `@layer components`, así que cualquier
utilidad de Tailwind escrita en el JSX puede ajustarlos sin `!important`.

Las animaciones usan dos mecanismos, cada uno para lo suyo:

- **Entradas al aparecer en pantalla** — el primitivo
  [`<Revelar>`](components/anim/Revelar.tsx) marca su contenedor con `data-ver`
  usando un IntersectionObserver, y el CSS dispara la variante que pida cada
  descendiente con `data-anim` (`subir`, `izq`, `escala`, `difuminar`,
  `cortina`…). Un observador por bloque, cero listeners de scroll.
- **Efectos continuos** — parallax, zoom, la barra de progreso de lectura y el
  botón de volver arriba se animan con `animation-timeline` contra el scroll.
  Corren fuera del hilo principal y sin JavaScript. Donde el navegador no lo
  soporta, simplemente no se aplican y todo sigue legible.

Todo respeta `prefers-reduced-motion`: quien pida menos movimiento ve la página
quieta y completa.

Para añadir una sección nueva, usa [`<Seccion>`](components/Seccion.tsx) y
[`<TituloSeccion>`](components/TituloSeccion.tsx): mantienen el mismo ritmo de
espaciados, anchos y fondos que el resto.

---

## ☁️ Desplegar en Vercel

1. Sube el proyecto a un repositorio de GitHub.
2. Entra a [vercel.com](https://vercel.com) → **Add New → Project** e importa el repo.
3. En **Environment Variables** agrega las **cinco** variables obligatorias
   (las dos `NEXT_PUBLIC_*`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD` y
   `ADMIN_SESSION_SECRET`). Cuando tengas dominio propio, añade
   `NEXT_PUBLIC_SITE_URL`.
4. **Deploy**. Vercel detecta Next.js automáticamente.

---

## 📁 Estructura

```
app/
  page.tsx                  Landing: compone las secciones y publica la ficha JSON-LD
  layout.tsx                Fuentes, metadatos y enlace de "saltar al contenido"
  globals.css               Sistema de diseño: tokens, base y componentes
  error.tsx / not-found.tsx Pantallas de error y 404
  sitemap.ts / robots.ts    Generados a partir de lib/sitio.ts
  acciones/reservas.ts      Alta de reservas: validación, antispam y límite por IP
  admin/
    login/page.tsx          Acceso con contraseña
    acciones.ts             Server Actions del panel (login, CRUD, subida de imágenes)
    (panel)/                Panel protegido: inicio, reservas, caballos, galería
components/
  anim/                     Revelar, TextoRevelado, Tarjeta3D, Contador, Polvo
  secciones/                Hero, Historia, Caballos, Cita, Servicios, Pasos,
                            Galeria, Testimonios, Reservar, PieRancho
  reserva/                  Invitación y formulario por pasos
  galeria/                  Mosaico y visor de fotos
  admin/                    Navegación, botones y campos del panel
  Dialogo, Seccion, TituloSeccion, Navbar, Marquee, Icono, FotoPlaceholder
lib/
  data.ts                   Contenido por defecto / no editable desde el panel
  sitio.ts                  URL pública y ficha de negocio para buscadores
  contenido.ts              Lee el contenido editable con respaldo a data.ts
  supabaseAdmin.ts          Cliente service_role (solo servidor)
  auth.ts                   Sesión del admin (cookie firmada)
  reservas/
    validacion.ts           Reglas del formulario, compartidas cliente y servidor
    antispam.ts             Token firmado, pregunta, huella de IP (solo servidor)
supabase/
  schema.sql                Script para crear toda la base de datos
```
