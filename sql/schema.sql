-- =====================================================
-- EduConnect para Supabase (PostgreSQL)
-- Pegar completo en: Dashboard > SQL Editor > New query > Run
-- =====================================================

-- ---------- Tipos ----------
create type public.rol_usuario as enum ('estudiante', 'docente', 'admin');
create type public.estado_inscripcion as enum ('activa', 'completada', 'cancelada');
create type public.tipo_material as enum ('video', 'pdf', 'enlace', 'texto');

-- ---------- Perfiles (enlazados a auth.users) ----------
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nombre      text not null default '',
  apellido    text not null default '',
  email       text,
  rol         public.rol_usuario not null default 'estudiante',
  avatar_url  text,
  creado_en   timestamptz not null default now()
);

-- Crear el perfil automáticamente al registrarse.
-- Solo permite 'estudiante' o 'docente' desde el registro; 'admin' se asigna a mano.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nombre, apellido, email, rol)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nombre', ''),
    coalesce(new.raw_user_meta_data ->> 'apellido', ''),
    new.email,
    case when new.raw_user_meta_data ->> 'rol' = 'docente'
         then 'docente'::public.rol_usuario
         else 'estudiante'::public.rol_usuario end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Tablas ----------
create table public.categorias (
  id      bigint generated always as identity primary key,
  nombre  text not null unique
);

create table public.cursos (
  id            bigint generated always as identity primary key,
  titulo        text not null,
  descripcion   text,
  docente_id    uuid not null references public.profiles(id) on delete restrict,
  categoria_id  bigint references public.categorias(id) on delete set null,
  imagen_url    text,
  publicado     boolean not null default false,
  creado_en     timestamptz not null default now()
);

create table public.inscripciones (
  id             bigint generated always as identity primary key,
  estudiante_id  uuid not null references public.profiles(id) on delete cascade,
  curso_id       bigint not null references public.cursos(id) on delete cascade,
  estado         public.estado_inscripcion not null default 'activa',
  progreso       smallint not null default 0 check (progreso between 0 and 100),
  inscrito_en    timestamptz not null default now(),
  unique (estudiante_id, curso_id)
);

create table public.materiales (
  id         bigint generated always as identity primary key,
  curso_id   bigint not null references public.cursos(id) on delete cascade,
  titulo     text not null,
  tipo       public.tipo_material not null default 'texto',
  contenido  text,
  orden      int not null default 0,
  creado_en  timestamptz not null default now()
);

create table public.tareas (
  id            bigint generated always as identity primary key,
  curso_id      bigint not null references public.cursos(id) on delete cascade,
  titulo        text not null,
  descripcion   text,
  fecha_limite  timestamptz,
  puntaje_max   numeric(5,2) not null default 10
);

create table public.entregas (
  id             bigint generated always as identity primary key,
  tarea_id       bigint not null references public.tareas(id) on delete cascade,
  estudiante_id  uuid not null references public.profiles(id) on delete cascade,
  contenido      text,
  archivo_url    text,
  calificacion   numeric(5,2),
  comentario     text,
  entregado_en   timestamptz not null default now(),
  unique (tarea_id, estudiante_id)
);

create table public.mensajes (
  id               bigint generated always as identity primary key,
  remitente_id     uuid not null references public.profiles(id) on delete cascade,
  destinatario_id  uuid not null references public.profiles(id) on delete cascade,
  asunto           text,
  cuerpo           text not null,
  leido            boolean not null default false,
  enviado_en       timestamptz not null default now()
);

-- ---------- Índices ----------
create index on public.cursos (docente_id);
create index on public.inscripciones (curso_id);
create index on public.materiales (curso_id, orden);
create index on public.tareas (curso_id);
create index on public.entregas (estudiante_id);
create index on public.mensajes (destinatario_id, leido);

-- ---------- Funciones auxiliares para las políticas ----------
create or replace function public.es_docente_del_curso(p_curso bigint)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.cursos
                 where id = p_curso and docente_id = auth.uid());
$$;

create or replace function public.esta_inscrito(p_curso bigint)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.inscripciones
                 where curso_id = p_curso and estudiante_id = auth.uid()
                   and estado <> 'cancelada');
$$;

-- =====================================================
-- RLS (seguridad por filas)
-- =====================================================
alter table public.profiles       enable row level security;
alter table public.categorias     enable row level security;
alter table public.cursos         enable row level security;
alter table public.inscripciones  enable row level security;
alter table public.materiales     enable row level security;
alter table public.tareas         enable row level security;
alter table public.entregas       enable row level security;
alter table public.mensajes       enable row level security;

-- profiles: cualquiera logueado ve perfiles; cada uno edita el suyo (sin poder cambiar su rol)
create policy "perfiles visibles para usuarios logueados"
  on public.profiles for select to authenticated using (true);
create policy "editar mi propio perfil"
  on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated;
grant update (nombre, apellido, avatar_url) on public.profiles to authenticated;

-- categorias: lectura pública
create policy "categorias publicas"
  on public.categorias for select using (true);

-- cursos
create policy "ver cursos publicados o propios"
  on public.cursos for select
  using (publicado or docente_id = auth.uid());
create policy "docentes crean sus cursos"
  on public.cursos for insert to authenticated
  with check (docente_id = auth.uid()
              and exists (select 1 from public.profiles
                          where id = auth.uid() and rol in ('docente','admin')));
create policy "docentes editan sus cursos"
  on public.cursos for update to authenticated
  using (docente_id = auth.uid()) with check (docente_id = auth.uid());
create policy "docentes borran sus cursos"
  on public.cursos for delete to authenticated
  using (docente_id = auth.uid());

-- inscripciones
create policy "ver mis inscripciones o las de mi curso"
  on public.inscripciones for select to authenticated
  using (estudiante_id = auth.uid() or public.es_docente_del_curso(curso_id));
create policy "inscribirme a un curso publicado"
  on public.inscripciones for insert to authenticated
  with check (estudiante_id = auth.uid()
              and exists (select 1 from public.cursos c
                          where c.id = curso_id and c.publicado));
create policy "actualizar mi inscripcion"
  on public.inscripciones for update to authenticated
  using (estudiante_id = auth.uid()) with check (estudiante_id = auth.uid());

-- materiales
create policy "ver materiales si estoy inscrito o soy docente"
  on public.materiales for select to authenticated
  using (public.esta_inscrito(curso_id) or public.es_docente_del_curso(curso_id));
create policy "docente gestiona materiales"
  on public.materiales for all to authenticated
  using (public.es_docente_del_curso(curso_id))
  with check (public.es_docente_del_curso(curso_id));

-- tareas
create policy "ver tareas si estoy inscrito o soy docente"
  on public.tareas for select to authenticated
  using (public.esta_inscrito(curso_id) or public.es_docente_del_curso(curso_id));
create policy "docente gestiona tareas"
  on public.tareas for all to authenticated
  using (public.es_docente_del_curso(curso_id))
  with check (public.es_docente_del_curso(curso_id));

-- entregas
create policy "ver mis entregas o las de mi curso"
  on public.entregas for select to authenticated
  using (estudiante_id = auth.uid()
         or exists (select 1 from public.tareas t
                    where t.id = tarea_id and public.es_docente_del_curso(t.curso_id)));
create policy "enviar mi entrega"
  on public.entregas for insert to authenticated
  with check (estudiante_id = auth.uid()
              and exists (select 1 from public.tareas t
                          where t.id = tarea_id and public.esta_inscrito(t.curso_id)));
create policy "docente califica"
  on public.entregas for update to authenticated
  using (exists (select 1 from public.tareas t
                 where t.id = tarea_id and public.es_docente_del_curso(t.curso_id)));

-- mensajes
create policy "ver mis mensajes"
  on public.mensajes for select to authenticated
  using (remitente_id = auth.uid() or destinatario_id = auth.uid());
create policy "enviar mensajes"
  on public.mensajes for insert to authenticated
  with check (remitente_id = auth.uid());
create policy "marcar como leido"
  on public.mensajes for update to authenticated
  using (destinatario_id = auth.uid()) with check (destinatario_id = auth.uid());

-- ---------- Datos iniciales ----------
insert into public.categorias (nombre) values
  ('Programación'), ('Matemática'), ('Idiomas');
