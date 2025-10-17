-- ============================================
-- DATOS INICIALES - CLÍNICA MONTELUZ
-- Ejecutar DESPUÉS del script de base de datos
-- ============================================

-- ============================================
-- INSERTAR ESPECIALIDADES
-- ============================================
INSERT INTO especialidades (nombre, descripcion) VALUES
  ('Medicina General', 'Atención médica general y preventiva'),
  ('Pediatría', 'Atención especializada para niños'),
  ('Cardiología', 'Especialistas en salud cardiovascular'),
  ('Dermatología', 'Cuidado de la piel'),
  ('Traumatología', 'Lesiones y fracturas'),
  ('Ginecología', 'Salud de la mujer'),
  ('Oftalmología', 'Cuidado de la vista'),
  ('Odontología', 'Salud dental')
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERTAR ADMINISTRADOR PRINCIPAL
-- ============================================
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
    telefono,
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
    '987654321',
    1
) ON CONFLICT (correo) DO NOTHING;

-- ============================================
-- INSERTAR SEDES
-- ============================================
INSERT INTO sedes (nombre, direccion, departamento, provincia, distrito, telefono, email, horario_apertura, horario_cierre) VALUES
  ('Sede Principal', 'Av. Principal 123', 'Lima', 'Lima', 'Miraflores', '01-234-5678', 'info@monteluz.com', '08:00:00', '18:00:00'),
  ('Sede Norte', 'Av. Túpac Amaru 456', 'Lima', 'Lima', 'San Martín de Porres', '01-234-5679', 'norte@monteluz.com', '08:00:00', '17:00:00'),
  ('Sede Sur', 'Av. Javier Prado 789', 'Lima', 'Lima', 'San Borja', '01-234-5680', 'sur@monteluz.com', '09:00:00', '19:00:00')
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERTAR MEDICAMENTOS
-- ============================================
INSERT INTO medicamentos (nombre, descripcion, precio, stock, principio_activo, presentacion, laboratorio) VALUES
  ('Paracetamol 500mg', 'Analgésico y antipirético', 5.50, 100, 'Paracetamol', 'Tabletas', 'Genfar'),
  ('Ibuprofeno 400mg', 'Antiinflamatorio y analgésico', 8.20, 80, 'Ibuprofeno', 'Tabletas', 'Bayer'),
  ('Amoxicilina 500mg', 'Antibiótico de amplio espectro', 12.80, 50, 'Amoxicilina', 'Cápsulas', 'GSK'),
  ('Omeprazol 20mg', 'Protector gástrico', 15.60, 60, 'Omeprazol', 'Cápsulas', 'AstraZeneca'),
  ('Loratadina 10mg', 'Antihistamínico', 6.90, 75, 'Loratadina', 'Tabletas', 'Teva')
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERTAR DOCTORES DE EJEMPLO
-- ============================================
INSERT INTO doctores (
    dni,
    nombre,
    apellidos,
    fecha_nacimiento,
    genero,
    correo,
    telefono,
    contraseña,
    numero_colegiatura,
    especialidad_id,
    biografia,
    años_experiencia,
    direccion,
    departamento,
    provincia,
    distrito
) VALUES (
    '87654321',
    'Dr. Carlos',
    'Mendoza',
    '1980-05-15',
    'masculino',
    'carlos.mendoza@monteluz.com',
    '987654321',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: doctor123
    'CM12345',
    1, -- Medicina General
    'Especialista en medicina general con más de 10 años de experiencia',
    10,
    'Av. Los Olivos 123',
    'Lima',
    'Lima',
    'Los Olivos'
),
(
    '76543210',
    'Dra. Ana',
    'García',
    '1985-08-20',
    'femenino',
    'ana.garcia@monteluz.com',
    '987654322',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: doctor123
    'AG67890',
    2, -- Pediatría
    'Pediatra especializada en atención infantil',
    8,
    'Av. San Borja 456',
    'Lima',
    'Lima',
    'San Borja'
)
ON CONFLICT (correo) DO NOTHING;

-- ============================================
-- INSERTAR PACIENTES DE EJEMPLO
-- ============================================
INSERT INTO usuarios (
    dni,
    nombre,
    apellidos,
    fecha_nacimiento,
    genero,
    correo,
    telefono,
    contraseña,
    direccion,
    departamento,
    provincia,
    distrito,
    tipo_sangre,
    alergias,
    condiciones_medicas
) VALUES (
    '11223344',
    'Juan',
    'Pérez',
    '1990-03-10',
    'masculino',
    'juan.perez@example.com',
    '987654323',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: paciente123
    'Av. Miraflores 789',
    'Lima',
    'Lima',
    'Miraflores',
    'O+',
    'Ninguna',
    'Ninguna'
),
(
    '22334455',
    'María',
    'González',
    '1985-07-25',
    'femenino',
    'maria.gonzalez@example.com',
    '987654324',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: paciente123
    'Av. San Isidro 321',
    'Lima',
    'Lima',
    'San Isidro',
    'A+',
    'Penicilina',
    'Hipertensión'
)
ON CONFLICT (correo) DO NOTHING;

-- ============================================
-- INSERTAR HORARIOS DE DOCTORES
-- ============================================
INSERT INTO horarios_doctores (doctor_id, sede_id, dia_semana, hora_inicio, hora_fin) VALUES
  (1, 1, 1, '08:00:00', '12:00:00'), -- Dr. Carlos - Lunes
  (1, 1, 3, '08:00:00', '12:00:00'), -- Dr. Carlos - Miércoles
  (1, 1, 5, '08:00:00', '12:00:00'), -- Dr. Carlos - Viernes
  (2, 1, 2, '09:00:00', '13:00:00'), -- Dra. Ana - Martes
  (2, 1, 4, '09:00:00', '13:00:00'), -- Dra. Ana - Jueves
  (2, 1, 6, '09:00:00', '13:00:00')  -- Dra. Ana - Sábado
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERTAR CITAS DE EJEMPLO
-- ============================================
INSERT INTO citas (paciente_id, doctor_id, sede_id, fecha, hora, estado, motivo) VALUES
  (1, 1, 1, '2024-10-20', '09:00:00', 'pendiente', 'Consulta general'),
  (2, 2, 1, '2024-10-21', '10:00:00', 'confirmada', 'Control pediátrico')
ON CONFLICT DO NOTHING;
