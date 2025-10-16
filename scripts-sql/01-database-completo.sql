-- ============================================
-- BASE DE DATOS COMPLETA - CLÍNICA MONTELUZ
-- PostgreSQL / Supabase
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: administradores
-- ============================================
CREATE TABLE IF NOT EXISTS administradores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dni TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  correo TEXT UNIQUE NOT NULL,
  contraseña TEXT NOT NULL,
  direccion TEXT,
  departamento TEXT,
  provincia TEXT,
  distrito TEXT,
  estado INTEGER NOT NULL DEFAULT 1 CHECK (estado IN (1, 2)), -- 1=Activo, 2=Inactivo
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para administradores
CREATE INDEX idx_administradores_dni ON administradores(dni);
CREATE INDEX idx_administradores_correo ON administradores(correo);
CREATE INDEX idx_administradores_estado ON administradores(estado);

-- ============================================
-- TABLA: usuarios (Solo pacientes)
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dni TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  genero TEXT NOT NULL CHECK (genero IN ('masculino', 'femenino', 'otro')),
  correo TEXT UNIQUE NOT NULL,
  telefono TEXT,
  contraseña TEXT NOT NULL,
  direccion TEXT,
  departamento TEXT,
  provincia TEXT,
  distrito TEXT,
  tipo_sangre TEXT,
  alergias TEXT,
  condiciones_medicas TEXT,
  contacto_emergencia_nombre TEXT,
  contacto_emergencia_telefono TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para usuarios (pacientes)
CREATE INDEX idx_usuarios_dni ON usuarios(dni);
CREATE INDEX idx_usuarios_correo ON usuarios(correo);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);
CREATE INDEX idx_usuarios_departamento ON usuarios(departamento);

-- ============================================
-- TABLA: doctores
-- ============================================
CREATE TABLE IF NOT EXISTS doctores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dni TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  genero TEXT NOT NULL CHECK (genero IN ('masculino', 'femenino', 'otro')),
  correo TEXT UNIQUE NOT NULL,
  telefono TEXT,
  contraseña TEXT NOT NULL,
  numero_colegiatura TEXT UNIQUE NOT NULL,
  especialidad_id UUID, -- Se agregará FK después de crear especialidades
  biografia TEXT,
  años_experiencia INTEGER,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para doctores
CREATE INDEX idx_doctores_dni ON doctores(dni);
CREATE INDEX idx_doctores_correo ON doctores(correo);
CREATE INDEX idx_doctores_colegiatura ON doctores(numero_colegiatura);
CREATE INDEX idx_doctores_activo ON doctores(activo);

-- ============================================
-- TABLA: especialidades
-- ============================================
CREATE TABLE IF NOT EXISTS especialidades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  icono TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para especialidades
CREATE INDEX idx_especialidades_nombre ON especialidades(nombre);
CREATE INDEX idx_especialidades_activo ON especialidades(activo);

-- ============================================
-- TABLA: sedes
-- ============================================
CREATE TABLE IF NOT EXISTS sedes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  telefono TEXT,
  email TEXT,
  horario_apertura TIME,
  horario_cierre TIME,
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  foto_url TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para sedes
CREATE INDEX idx_sedes_nombre ON sedes(nombre);
CREATE INDEX idx_sedes_ciudad ON sedes(ciudad);
CREATE INDEX idx_sedes_activo ON sedes(activo);

-- ============================================
-- TABLA: servicios
-- ============================================
CREATE TABLE IF NOT EXISTS servicios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  duracion_minutos INTEGER,
  precio DECIMAL(10, 2),
  especialidad_id UUID REFERENCES especialidades(id),
  icono TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para servicios
CREATE INDEX idx_servicios_especialidad ON servicios(especialidad_id);
CREATE INDEX idx_servicios_activo ON servicios(activo);

-- ============================================
-- TABLA: citas
-- ============================================
CREATE TABLE IF NOT EXISTS citas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctores(id) ON DELETE CASCADE,
  servicio_id UUID REFERENCES servicios(id),
  sede_id UUID REFERENCES sedes(id),
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'completada')) DEFAULT 'pendiente',
  motivo TEXT,
  notas TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para citas
CREATE INDEX idx_citas_paciente ON citas(paciente_id);
CREATE INDEX idx_citas_doctor ON citas(doctor_id);
CREATE INDEX idx_citas_fecha ON citas(fecha);
CREATE INDEX idx_citas_estado ON citas(estado);

-- ============================================
-- TABLA: horarios_doctores
-- ============================================
CREATE TABLE IF NOT EXISTS horarios_doctores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctores(id) ON DELETE CASCADE,
  sede_id UUID REFERENCES sedes(id),
  dia_semana INTEGER CHECK (dia_semana BETWEEN 0 AND 6), -- 0=Domingo, 6=Sábado
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para horarios
CREATE INDEX idx_horarios_doctor ON horarios_doctores(doctor_id);
CREATE INDEX idx_horarios_sede ON horarios_doctores(sede_id);

-- ============================================
-- TABLA: contacto_mensajes
-- ============================================
CREATE TABLE IF NOT EXISTS contacto_mensajes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  asunto TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT false,
  respondido BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mensajes de contacto
CREATE INDEX idx_contacto_leido ON contacto_mensajes(leido);
CREATE INDEX idx_contacto_created ON contacto_mensajes(created_at);

-- ============================================
-- AGREGAR FOREIGN KEYS FALTANTES
-- ============================================

-- Agregar FK de especialidad a doctores
ALTER TABLE doctores 
ADD CONSTRAINT fk_doctores_especialidad 
FOREIGN KEY (especialidad_id) REFERENCES especialidades(id);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER trigger_administradores_updated_at
  BEFORE UPDATE ON administradores
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_doctores_updated_at
  BEFORE UPDATE ON doctores
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_sedes_updated_at
  BEFORE UPDATE ON sedes
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_servicios_updated_at
  BEFORE UPDATE ON servicios
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_citas_updated_at
  BEFORE UPDATE ON citas
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_especialidades_updated_at
  BEFORE UPDATE ON especialidades
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar especialidades de ejemplo
INSERT INTO especialidades (nombre, descripcion, icono) VALUES
  ('Medicina General', 'Atención médica general y preventiva', '🩺'),
  ('Pediatría', 'Atención especializada para niños', '👶'),
  ('Cardiología', 'Especialistas en salud cardiovascular', '❤️'),
  ('Dermatología', 'Cuidado de la piel', '🧴'),
  ('Traumatología', 'Lesiones y fracturas', '🦴'),
  ('Ginecología', 'Salud de la mujer', '👩‍⚕️'),
  ('Oftalmología', 'Cuidado de la vista', '👁️'),
  ('Odontología', 'Salud dental', '🦷')
ON CONFLICT DO NOTHING;

-- Insertar administrador principal
INSERT INTO administradores (
    dni,
    nombre,
    apellidos,
    fecha_nacimiento,
    correo,
    contraseña,
    direccion,
    departamento,
    provincia,
    distrito,
    estado
) VALUES (
    '12345678',
    'Administrador',
    'Principal',
    '1990-01-01',
    'admin@monteluz.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: admin123
    'Av. Principal 123',
    'Lima',
    'Lima',
    'Miraflores',
    1
);

-- ============================================
-- POLÍTICAS DE SEGURIDAD (Row Level Security)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE administradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctores ENABLE ROW LEVEL SECURITY;
ALTER TABLE especialidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE sedes ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios_doctores ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar según necesidades)
-- Los administradores pueden ver todos los datos
CREATE POLICY "Administradores pueden ver todos los datos"
  ON usuarios FOR ALL
  USING (true);

CREATE POLICY "Administradores pueden ver todos los doctores"
  ON doctores FOR ALL
  USING (true);

-- ============================================
-- FIN DEL SCHEMA COMPLETO
-- ============================================
