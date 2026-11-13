-- =====================================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS - EDUCONNECT
-- =====================================================================

-- 1. TABLA DE ROLES
CREATE TABLE public.roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE, -- Ej: 'Administrador', 'Profesor', 'Alumno'
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. TABLA DE PERFILES DE USUARIO (Vinculada a auth.users de Supabase)
CREATE TABLE public.perfiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    rol_id INT REFERENCES public.roles(id) DEFAULT 3, -- Por defecto Alumno
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. TABLA DE CURSOS
CREATE TABLE public.cursos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    profesor_id UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TABLA DE INSCRIPCIONES (Relación Alumnos - Cursos)
CREATE TABLE public.inscripciones (
    id SERIAL PRIMARY KEY,
    curso_id INT REFERENCES public.cursos(id) ON DELETE CASCADE,
    alumno_id UUID REFERENCES public.perfiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(curso_id, alumno_id)
);

-- 5. TABLA DE CALIFICACIONES (Bloque de Grade Tracking)
CREATE TABLE public.calificaciones (
    id SERIAL PRIMARY KEY,
    curso_id INT REFERENCES public.cursos(id) ON DELETE CASCADE,
    alumno_id UUID REFERENCES public.perfiles(id) ON DELETE CASCADE,
    evaluacion VARCHAR(150) NOT NULL, -- Ej: 'Examen Parcial', 'Trabajo Práctico'
    calificacion NUMERIC(5, 2) NOT NULL, -- Nota numérica
    retroalimentacion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. TABLA DE EVENTOS (Tarjetas de Calendario Dinámicas)
CREATE TABLE public.eventos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    ubicacion VARCHAR(255),
    creador_id UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. TABLA DE AVISOS Y NOTIFICACIONES
CREATE TABLE public.avisos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    autor_id UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
    curso_id INT REFERENCES public.cursos(id) ON DELETE CASCADE, -- Opcional, si es para un curso específico
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. TABLA DE CONFIGURACIÓN (Ajustes de usuario y administración)
CREATE TABLE public.configuracion (
    id SERIAL PRIMARY KEY,
    usuario_id UUID REFERENCES public.perfiles(id) ON DELETE CASCADE,
    clave VARCHAR(100) NOT NULL,
    valor TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(usuario_id, clave)
);

-- =====================================================================
-- 9. SEGURIDAD: HABILITAR ROW LEVEL SECURITY (RLS) Y POLÍTICAS BÁSICAS
-- =====================================================================
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avisos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracion ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura básica para usuarios autenticados
CREATE POLICY "Permitir lectura de roles" ON public.roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir lectura de perfiles" ON public.perfiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Actualizar propio perfil" ON public.perfiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Permitir lectura de cursos" ON public.cursos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir lectura de inscripciones" ON public.inscripciones FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir lectura de calificaciones" ON public.calificaciones FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir lectura de eventos" ON public.eventos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir lectura de avisos" ON public.avisos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir lectura de configuracion" ON public.configuracion FOR SELECT TO authenticated USING (auth.uid() = usuario_id);