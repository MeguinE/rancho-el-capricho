-- ============================================================
--  Rancho el Capricho — Esquema de base de datos (Supabase)
--  Cómo usarlo:
--    1. Entra a tu proyecto en https://supabase.com
--    2. Menú izquierdo → SQL Editor → New query
--    3. Pega TODO este archivo y pulsa "Run"
--  Es seguro volver a ejecutarlo: usa "if not exists" / "on conflict".
-- ============================================================

-- ---------- RESERVAS (las solicitudes del formulario) ----------
create table if not exists public.reservas (
  id            uuid primary key default gen_random_uuid(),
  creado_en     timestamptz not null default now(),
  nombre        text not null,
  email         text,
  telefono      text,
  tipo_evento   text,
  fecha_evento  date,
  num_caballos  int default 1,
  mensaje       text,
  estado        text not null default 'nueva'  -- nueva | contactada | cerrada
);

alter table public.reservas enable row level security;

-- Cualquiera puede ENVIAR una reserva (insertar)...
drop policy if exists "reservas_insert_publico" on public.reservas;
create policy "reservas_insert_publico"
  on public.reservas for insert
  to anon, authenticated
  with check (true);
-- ...pero NADIE puede leerlas con la clave pública.
-- El panel de admin las lee con la clave service_role (que salta RLS).

-- ---------- CABALLOS ----------
create table if not exists public.caballos (
  id            uuid primary key default gen_random_uuid(),
  creado_en     timestamptz not null default now(),
  orden         int not null default 0,
  nombre        text not null,
  raza          text,
  temperamento  text,
  descripcion   text,
  img_url       text
);

alter table public.caballos enable row level security;

drop policy if exists "caballos_select_publico" on public.caballos;
create policy "caballos_select_publico"
  on public.caballos for select
  to anon, authenticated
  using (true);
-- Escritura: solo desde el admin (service_role salta RLS).

-- ---------- GALERÍA ----------
create table if not exists public.galeria (
  id          uuid primary key default gen_random_uuid(),
  creado_en   timestamptz not null default now(),
  orden       int not null default 0,
  url         text not null,
  alt         text
);

alter table public.galeria enable row level security;

drop policy if exists "galeria_select_publico" on public.galeria;
create policy "galeria_select_publico"
  on public.galeria for select
  to anon, authenticated
  using (true);

-- ---------- CONFIGURACIÓN (logo y otros ajustes clave/valor) ----------
create table if not exists public.config (
  clave  text primary key,
  valor  text
);

alter table public.config enable row level security;

drop policy if exists "config_select_publico" on public.config;
create policy "config_select_publico"
  on public.config for select
  to anon, authenticated
  using (true);

-- ============================================================
--  DATOS INICIALES (los 4 caballos y la galería por defecto)
--  Solo se insertan si las tablas están vacías.
-- ============================================================
insert into public.caballos (orden, nombre, raza, temperamento, descripcion, img_url)
select * from (values
  (1, 'Relámpago', 'Azteca', 'Dócil',
   'Noble y elegante, perfecto para entradas de novia y fotografías de alto impacto.',
   'https://images.unsplash.com/photo-1450052590821-8bf91254a353?auto=format&fit=crop&q=80&w=800'),
  (2, 'Lucero', 'Islandés', 'Tierno',
   'El consentido de los niños. Tranquilo, paciente y de melena espectacular.',
   'https://images.unsplash.com/photo-1566251037378-5e04e3bec343?auto=format&fit=crop&q=80&w=800'),
  (3, 'Tornado', 'Pura Sangre', 'Imponente',
   'Mirada imponente y porte de campeón. El favorito para bodas y sesiones dramáticas.',
   'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80&w=800'),
  (4, 'Canela', 'Cuarto de Milla', 'Noble',
   'Manto cálido y carácter dulce. Ideal para cabalgatas y eventos al atardecer.',
   'https://images.unsplash.com/photo-1534773728080-33d31da27ae5?auto=format&fit=crop&q=80&w=800')
) as v
where not exists (select 1 from public.caballos);

insert into public.galeria (orden, url, alt)
select * from (values
  (1, 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=1000', 'Caballo galopando'),
  (2, 'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?auto=format&fit=crop&q=80&w=800', 'Caballos en el rancho'),
  (3, 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=800', 'Atardecer en el campo'),
  (4, 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80&w=1000', 'Retrato de caballo'),
  (5, 'https://images.unsplash.com/photo-1566251037378-5e04e3bec343?auto=format&fit=crop&q=80&w=800', 'Caballo de melena dorada'),
  (6, 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&q=80&w=800', 'Granero del rancho'),
  (7, 'https://images.unsplash.com/photo-1450052590821-8bf91254a353?auto=format&fit=crop&q=80&w=1000', 'Caballo en la pradera'),
  (8, 'https://images.unsplash.com/photo-1534773728080-33d31da27ae5?auto=format&fit=crop&q=80&w=800', 'Caballo pastando')
) as v
where not exists (select 1 from public.galeria);

-- ============================================================
--  STORAGE: bucket público "imagenes" para logo, caballos y galería
-- ============================================================
insert into storage.buckets (id, name, public)
values ('imagenes', 'imagenes', true)
on conflict (id) do nothing;

-- Lectura pública de las imágenes del bucket
drop policy if exists "imagenes_lectura_publica" on storage.objects;
create policy "imagenes_lectura_publica"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'imagenes');
-- Las subidas/borrados los hace el admin con service_role (salta RLS).
