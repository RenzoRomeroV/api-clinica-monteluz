-- =====================================================
-- SCRIPT DE CONFIGURACIÓN DE BASE DE DATOS
-- CLÍNICA MONTELUZ - SUPABASE POSTGRESQL
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABLA DE USUARIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dni VARCHAR(8) NOT NULL UNIQUE,
    nombre VARCHAR(40) NOT NULL,
    apellido_paterno VARCHAR(40) NOT NULL,
    apellido_materno VARCHAR(40) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo VARCHAR(10) NOT NULL CHECK (sexo IN ('Masculino', 'Femenino')),
    correo VARCHAR(100) NOT NULL UNIQUE,
    celular VARCHAR(9) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL DEFAULT 'paciente' CHECK (tipo_usuario IN ('paciente', 'doctor', 'administrador')),
    codigo_medico VARCHAR(8) UNIQUE,
    especialidad VARCHAR(50),
    colegiatura VARCHAR(6),
    cargo VARCHAR(50),
    nivel_acceso VARCHAR(20),
    codigo_admin VARCHAR(7) UNIQUE,
    activo BOOLEAN DEFAULT true,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. TABLA DE ESPECIALIDADES MÉDICAS
-- =====================================================
CREATE TABLE IF NOT EXISTS especialidades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. TABLA DE DOCTORES
-- =====================================================
CREATE TABLE IF NOT EXISTS doctores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    especialidad_id UUID REFERENCES especialidades(id),
    codigo_medico VARCHAR(8) NOT NULL UNIQUE,
    colegiatura VARCHAR(6) NOT NULL,
    horario_inicio TIME,
    horario_fin TIME,
    dias_trabajo VARCHAR(50),
    consultorio VARCHAR(50),
    activo BOOLEAN DEFAULT true,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. TABLA DE CITAS MÉDICAS
-- =====================================================
CREATE TABLE IF NOT EXISTS citas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctores(id) ON DELETE SET NULL,
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    tipo_cita VARCHAR(30) NOT NULL DEFAULT 'consulta' CHECK (tipo_cita IN ('consulta', 'control', 'emergencia', 'procedimiento')),
    motivo TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'en_progreso', 'completada', 'cancelada', 'reprogramada')),
    notas_medicas TEXT,
    diagnostico TEXT,
    tratamiento TEXT,
    receta_medica TEXT,
    costo DECIMAL(10,2),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. TABLA DE HISTORIAL MÉDICO
-- =====================================================
CREATE TABLE IF NOT EXISTS historial_medico (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    cita_id UUID REFERENCES citas(id) ON DELETE SET NULL,
    doctor_id UUID REFERENCES doctores(id) ON DELETE SET NULL,
    fecha_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sintomas TEXT,
    diagnostico TEXT,
    tratamiento TEXT,
    medicamentos TEXT,
    observaciones TEXT,
    archivos_adjuntos JSONB
);

-- =====================================================
-- 6. TABLA DE HORARIOS DISPONIBLES
-- =====================================================
CREATE TABLE IF NOT EXISTS horarios_disponibles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES doctores(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    disponible BOOLEAN DEFAULT true,
    cita_id UUID REFERENCES citas(id) ON DELETE SET NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 7. TABLA DE NOTIFICACIONES
-- =====================================================
CREATE TABLE IF NOT EXISTS notificaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('info', 'warning', 'success', 'error', 'cita', 'recordatorio')),
    leida BOOLEAN DEFAULT false,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP
);

-- =====================================================
-- 8. TABLA DE CONFIGURACIÓN DEL SISTEMA
-- =====================================================
CREATE TABLE IF NOT EXISTS configuracion_sistema (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clave VARCHAR(50) NOT NULL UNIQUE,
    valor TEXT,
    descripcion TEXT,
    tipo VARCHAR(20) DEFAULT 'string' CHECK (tipo IN ('string', 'number', 'boolean', 'json')),
    activo BOOLEAN DEFAULT true,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_dni ON usuarios(dni);
CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo_usuario);

-- Índices para citas
CREATE INDEX IF NOT EXISTS idx_citas_paciente ON citas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_citas_doctor ON citas(doctor_id);
CREATE INDEX IF NOT EXISTS idx_citas_fecha ON citas(fecha_cita);
CREATE INDEX IF NOT EXISTS idx_citas_estado ON citas(estado);

-- Índices para doctores
CREATE INDEX IF NOT EXISTS idx_doctores_usuario ON doctores(usuario_id);
CREATE INDEX IF NOT EXISTS idx_doctores_especialidad ON doctores(especialidad_id);
CREATE INDEX IF NOT EXISTS idx_doctores_codigo ON doctores(codigo_medico);

-- Índices para historial médico
CREATE INDEX IF NOT EXISTS idx_historial_paciente ON historial_medico(paciente_id);
CREATE INDEX IF NOT EXISTS idx_historial_fecha ON historial_medico(fecha_consulta);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar especialidades médicas
INSERT INTO especialidades (nombre, descripcion) VALUES
('Medicina General', 'Atención médica integral para toda la familia'),
('Pediatría', 'Cuidado especializado para bebés, niños y adolescentes'),
('Ginecología', 'Atención integral de la salud femenina'),
('Cardiología', 'Especialistas en el cuidado del corazón y sistema cardiovascular'),
('Dermatología', 'Cuidado de la piel, cabello y uñas'),
('Traumatología', 'Tratamiento de lesiones del sistema musculoesquelético'),
('Neurología', 'Especialistas en el diagnóstico y tratamiento de enfermedades del sistema nervioso'),
('Oftalmología', 'Diagnóstico y tratamiento de enfermedades oculares'),
('Psicología', 'Atención psicológica integral para todas las edades'),
('Odontología', 'Servicios dentales completos con tecnología moderna')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar configuración inicial del sistema
INSERT INTO configuracion_sistema (clave, valor, descripcion, tipo) VALUES
('horario_atencion_inicio', '08:00', 'Hora de inicio de atención', 'string'),
('horario_atencion_fin', '20:00', 'Hora de fin de atención', 'string'),
('duracion_cita_minutos', '30', 'Duración estándar de una cita en minutos', 'number'),
('dias_anticipacion_cita', '1', 'Días mínimos de anticipación para agendar cita', 'number'),
('costo_consulta_general', '50.00', 'Costo de consulta general', 'number'),
('version_sistema', '1.0.0', 'Versión actual del sistema', 'string'),
('mantenimiento_activo', 'false', 'Indica si el sistema está en mantenimiento', 'boolean')
ON CONFLICT (clave) DO NOTHING;

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar fecha_actualizacion
CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_citas_updated_at 
    BEFORE UPDATE ON citas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- POLÍTICAS DE SEGURIDAD RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE especialidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctores ENABLE ROW LEVEL SECURITY;
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_medico ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios_disponibles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_sistema ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (se pueden ajustar según necesidades)
-- Los usuarios solo pueden ver y modificar sus propios datos
CREATE POLICY "Users can view own profile" ON usuarios
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON usuarios
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Las citas son visibles para pacientes y doctores involucrados
CREATE POLICY "Users can view own appointments" ON citas
    FOR SELECT USING (
        auth.uid()::text = paciente_id::text OR 
        auth.uid()::text = doctor_id::text
    );

-- Las especialidades son visibles para todos
CREATE POLICY "Specialties are viewable by everyone" ON especialidades
    FOR SELECT USING (true);

-- =====================================================
-- MENSAJE DE CONFIRMACIÓN
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'BASE DE DATOS CLÍNICA MONTELUZ CONFIGURADA EXITOSAMENTE';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Tablas creadas:';
    RAISE NOTICE '- usuarios';
    RAISE NOTICE '- especialidades';
    RAISE NOTICE '- doctores';
    RAISE NOTICE '- citas';
    RAISE NOTICE '- historial_medico';
    RAISE NOTICE '- horarios_disponibles';
    RAISE NOTICE '- notificaciones';
    RAISE NOTICE '- configuracion_sistema';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Índices y políticas de seguridad configurados';
    RAISE NOTICE 'Datos iniciales insertados';
    RAISE NOTICE '=====================================================';
END $$;
