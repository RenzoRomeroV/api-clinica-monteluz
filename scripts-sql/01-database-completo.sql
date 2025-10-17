-- ============================================
-- BASE DE DATOS COMPLETA - CLÍNICA MONTELUZ
-- PostgreSQL / Supabase
-- ============================================

-- ============================================
-- TABLA: administradores
-- ============================================
CREATE TABLE IF NOT EXISTS administradores (
  id SERIAL PRIMARY KEY,
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
  telefono TEXT,
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
  id SERIAL PRIMARY KEY,
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
  id SERIAL PRIMARY KEY,
  dni TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  genero TEXT NOT NULL CHECK (genero IN ('masculino', 'femenino', 'otro')),
  correo TEXT UNIQUE NOT NULL,
  telefono TEXT,
  contraseña TEXT NOT NULL,
  numero_colegiatura TEXT UNIQUE NOT NULL,
  especialidad_id INTEGER, -- Se agregará FK después de crear especialidades
  biografia TEXT,
  años_experiencia INTEGER,
  direccion TEXT,
  departamento TEXT,
  provincia TEXT,
  distrito TEXT,
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
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
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
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  departamento TEXT,
  provincia TEXT,
  distrito TEXT,
  telefono TEXT,
  email TEXT,
  horario_apertura TIME,
  horario_cierre TIME,
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para sedes
CREATE INDEX idx_sedes_nombre ON sedes(nombre);
CREATE INDEX idx_sedes_departamento ON sedes(departamento);
CREATE INDEX idx_sedes_activo ON sedes(activo);

-- ============================================
-- TABLA: medicamentos
-- ============================================
CREATE TABLE IF NOT EXISTS medicamentos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  imagen_url TEXT,
  principio_activo TEXT,
  presentacion TEXT,
  laboratorio TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para medicamentos
CREATE INDEX idx_medicamentos_nombre ON medicamentos(nombre);
CREATE INDEX idx_medicamentos_principio_activo ON medicamentos(principio_activo);
CREATE INDEX idx_medicamentos_activo ON medicamentos(activo);
CREATE INDEX idx_medicamentos_stock ON medicamentos(stock);

-- ============================================
-- TABLA: citas
-- ============================================
CREATE TABLE IF NOT EXISTS citas (
  id SERIAL PRIMARY KEY,
  paciente_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  doctor_id INTEGER REFERENCES doctores(id) ON DELETE CASCADE,
  sede_id INTEGER REFERENCES sedes(id),
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
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER REFERENCES doctores(id) ON DELETE CASCADE,
  sede_id INTEGER REFERENCES sedes(id),
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
  id SERIAL PRIMARY KEY,
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

CREATE TRIGGER trigger_especialidades_updated_at
  BEFORE UPDATE ON especialidades
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_sedes_updated_at
  BEFORE UPDATE ON sedes
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_medicamentos_updated_at
  BEFORE UPDATE ON medicamentos
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_citas_updated_at
  BEFORE UPDATE ON citas
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

-- ============================================
-- POLÍTICAS DE SEGURIDAD (Row Level Security)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE administradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctores ENABLE ROW LEVEL SECURITY;
ALTER TABLE especialidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE sedes ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicamentos ENABLE ROW LEVEL SECURITY;
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
