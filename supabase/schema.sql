-- ============================================================
--  Rancho el Capricho — Esquema de base de datos para Supabase
--  Cómo usarlo:
--    1. Entra a tu proyecto en https://supabase.com
--    2. Menú lateral → SQL Editor → New query
--    3. Pega TODO este archivo y dale "Run"
-- ============================================================

-- Tabla de solicitudes de reserva que envía el formulario del sitio
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
  atendido      boolean not null default false
);

-- Activamos Row Level Security (seguridad por fila)
alter table public.reservas enable row level security;

-- Permitimos que CUALQUIER visitante (clave anónima) pueda INSERTAR una reserva,
-- pero NO leer las reservas de los demás. Tú las verás desde el panel de Supabase.
drop policy if exists "publico_puede_crear_reservas" on public.reservas;
create policy "publico_puede_crear_reservas"
  on public.reservas
  for insert
  to anon
  with check (true);

-- (Opcional) Si más adelante quieres una galería administrada desde Supabase,
-- descomenta esta tabla y guarda las URLs de las imágenes que subas a Storage.
--
-- create table if not exists public.galeria (
--   id         uuid primary key default gen_random_uuid(),
--   creado_en  timestamptz not null default now(),
--   titulo     text,
--   url        text not null,
--   orden      int default 0,
--   visible    boolean not null default true
-- );
-- alter table public.galeria enable row level security;
-- create policy "publico_puede_ver_galeria"
--   on public.galeria for select to anon using (visible = true);
