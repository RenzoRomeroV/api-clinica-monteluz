-- ============================================
-- VERIFICAR SISTEMA - CLÍNICA MONTELUZ
-- Ejecutar para verificar que todo esté funcionando
-- ============================================

-- ============================================
-- VERIFICAR TABLAS CREADAS
-- ============================================
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ============================================
-- VERIFICAR ADMINISTRADORES
-- ============================================
SELECT 
    id,
    dni,
    nombre,
    apellidos,
    correo,
    estado,
    created_at
FROM administradores
ORDER BY id;

-- ============================================
-- VERIFICAR USUARIOS (PACIENTES)
-- ============================================
SELECT 
    id,
    dni,
    nombre,
    apellidos,
    correo,
    activo,
    created_at
FROM usuarios
ORDER BY id;

-- ============================================
-- VERIFICAR DOCTORES
-- ============================================
SELECT 
    d.id,
    d.dni,
    d.nombre,
    d.apellidos,
    d.correo,
    d.numero_colegiatura,
    e.nombre as especialidad,
    d.activo
FROM doctores d
LEFT JOIN especialidades e ON d.especialidad_id = e.id
ORDER BY d.id;

-- ============================================
-- VERIFICAR ESPECIALIDADES
-- ============================================
SELECT 
    id,
    nombre,
    descripcion,
    activo
FROM especialidades
ORDER BY id;

-- ============================================
-- VERIFICAR SEDES
-- ============================================
SELECT 
    id,
    nombre,
    direccion,
    departamento,
    provincia,
    distrito,
    telefono,
    activo
FROM sedes
ORDER BY id;

-- ============================================
-- VERIFICAR MEDICAMENTOS
-- ============================================
SELECT 
    id,
    nombre,
    precio,
    stock,
    principio_activo,
    laboratorio,
    activo
FROM medicamentos
ORDER BY id;

-- ============================================
-- VERIFICAR CITAS
-- ============================================
SELECT 
    c.id,
    u.nombre || ' ' || u.apellidos as paciente,
    d.nombre || ' ' || d.apellidos as doctor,
    s.nombre as sede,
    c.fecha,
    c.hora,
    c.estado,
    c.motivo
FROM citas c
LEFT JOIN usuarios u ON c.paciente_id = u.id
LEFT JOIN doctores d ON c.doctor_id = d.id
LEFT JOIN sedes s ON c.sede_id = s.id
ORDER BY c.fecha, c.hora;

-- ============================================
-- VERIFICAR HORARIOS DE DOCTORES
-- ============================================
SELECT 
    h.id,
    d.nombre || ' ' || d.apellidos as doctor,
    s.nombre as sede,
    CASE h.dia_semana
        WHEN 0 THEN 'Domingo'
        WHEN 1 THEN 'Lunes'
        WHEN 2 THEN 'Martes'
        WHEN 3 THEN 'Miércoles'
        WHEN 4 THEN 'Jueves'
        WHEN 5 THEN 'Viernes'
        WHEN 6 THEN 'Sábado'
    END as dia,
    h.hora_inicio,
    h.hora_fin,
    h.activo
FROM horarios_doctores h
LEFT JOIN doctores d ON h.doctor_id = d.id
LEFT JOIN sedes s ON h.sede_id = s.id
ORDER BY h.doctor_id, h.dia_semana;

-- ============================================
-- VERIFICAR MENSAJES DE CONTACTO
-- ============================================
SELECT 
    id,
    nombre,
    email,
    asunto,
    leido,
    respondido,
    created_at
FROM contacto_mensajes
ORDER BY created_at DESC;

-- ============================================
-- VERIFICAR FUNCIONES Y TRIGGERS
-- ============================================
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- ============================================
-- VERIFICAR ÍNDICES
-- ============================================
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ============================================
-- VERIFICAR POLÍTICAS RLS
-- ============================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- RESUMEN DE DATOS
-- ============================================
SELECT 
    'Administradores' as tabla,
    COUNT(*) as total
FROM administradores
UNION ALL
SELECT 
    'Usuarios (Pacientes)' as tabla,
    COUNT(*) as total
FROM usuarios
UNION ALL
SELECT 
    'Doctores' as tabla,
    COUNT(*) as total
FROM doctores
UNION ALL
SELECT 
    'Especialidades' as tabla,
    COUNT(*) as total
FROM especialidades
UNION ALL
SELECT 
    'Sedes' as tabla,
    COUNT(*) as total
FROM sedes
UNION ALL
SELECT 
    'Medicamentos' as tabla,
    COUNT(*) as total
FROM medicamentos
UNION ALL
SELECT 
    'Citas' as tabla,
    COUNT(*) as total
FROM citas
UNION ALL
SELECT 
    'Horarios' as tabla,
    COUNT(*) as total
FROM horarios_doctores
UNION ALL
SELECT 
    'Mensajes de Contacto' as tabla,
    COUNT(*) as total
FROM contacto_mensajes
ORDER BY tabla;
