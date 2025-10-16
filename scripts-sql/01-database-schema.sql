-- ============================================
-- SCHEMA DE BASE DE DATOS - CLÍNICA MONTELUZ
-- PostgreSQL / Supabase
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  telefono TEXT,
  rol TEXT NOT NULL CHECK (rol IN ('paciente', 'doctor', 'admin', 'recepcionista')),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);

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

-- ============================================
-- TABLA: doctores
-- ============================================
CREATE TABLE IF NOT EXISTS doctores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  especialidad_id UUID REFERENCES especialidades(id),
  numero_colegiatura TEXT,
  biografia TEXT,
  años_experiencia INTEGER,
  foto_url TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para doctores
CREATE INDEX idx_doctores_usuario ON doctores(usuario_id);
CREATE INDEX idx_doctores_especialidad ON doctores(especialidad_id);

-- ============================================
-- TABLA: pacientes
-- ============================================
CREATE TABLE IF NOT EXISTS pacientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  fecha_nacimiento DATE,
  genero TEXT CHECK (genero IN ('masculino', 'femenino', 'otro')),
  direccion TEXT,
  ciudad TEXT,
  codigo_postal TEXT,
  contacto_emergencia_nombre TEXT,
  contacto_emergencia_telefono TEXT,
  tipo_sangre TEXT,
  alergias TEXT,
  condiciones_medicas TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para pacientes
CREATE INDEX idx_pacientes_usuario ON pacientes(usuario_id);

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

-- ============================================
-- TABLA: citas
-- ============================================
CREATE TABLE IF NOT EXISTS citas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
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
CREATE TRIGGER trigger_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_doctores_updated_at
  BEFORE UPDATE ON doctores
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_pacientes_updated_at
  BEFORE UPDATE ON pacientes
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
-- DATOS DE EJEMPLO
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

-- ============================================
-- POLÍTICAS DE SEGURIDAD (Row Level Security)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE sedes ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE especialidades ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar según necesidades)
-- Ejemplo: Los usuarios pueden ver su propia información
CREATE POLICY "Los usuarios pueden ver su propia información"
  ON usuarios FOR SELECT
  USING (auth.uid() = id);

-- Ejemplo: Los pacientes pueden ver sus propias citas
CREATE POLICY "Los pacientes pueden ver sus citas"
  ON citas FOR SELECT
  USING (auth.uid() = paciente_id);

-- ============================================
-- FIN DEL SCHEMA
-- ============================================
