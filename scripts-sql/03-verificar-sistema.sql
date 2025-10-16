-- ============================================
-- VERIFICAR SISTEMA COMPLETO
-- Ejecutar para verificar que todo funciona
-- ============================================

-- Verificar todas las tablas creadas
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Verificar administrador
SELECT 
    '👑 ADMINISTRADOR' as tipo,
    email,
    nombre || ' ' || apellido as nombre_completo,
    rol,
    activo,
    created_at
FROM usuarios 
WHERE rol = 'admin';

-- Verificar especialidades creadas
SELECT 
    '🩺 ESPECIALIDADES' as tipo,
    nombre,
    descripcion,
    icono,
    activo
FROM especialidades 
ORDER BY nombre;

-- Verificar estructura de tabla usuarios
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
ORDER BY ordinal_position;

-- Contar registros por tabla
SELECT 
    'usuarios' as tabla,
    COUNT(*) as registros
FROM usuarios
UNION ALL
SELECT 
    'especialidades' as tabla,
    COUNT(*) as registros
FROM especialidades
UNION ALL
SELECT 
    'doctores' as tabla,
    COUNT(*) as registros
FROM doctores
UNION ALL
SELECT 
    'pacientes' as tabla,
    COUNT(*) as registros
FROM pacientes
UNION ALL
SELECT 
    'sedes' as tabla,
    COUNT(*) as registros
FROM sedes
UNION ALL
SELECT 
    'servicios' as tabla,
    COUNT(*) as registros
FROM servicios
UNION ALL
SELECT 
    'citas' as tabla,
    COUNT(*) as registros
FROM citas
UNION ALL
SELECT 
    'horarios_doctores' as tabla,
    COUNT(*) as registros
FROM horarios_doctores
UNION ALL
SELECT 
    'contacto_mensajes' as tabla,
    COUNT(*) as registros
FROM contacto_mensajes;

-- Verificar que la contraseña está encriptada
SELECT 
    '🔐 SEGURIDAD' as tipo,
    email,
    CASE 
        WHEN password LIKE '$2b$%' THEN '✅ Contraseña encriptada (bcrypt)'
        ELSE '❌ Contraseña NO encriptada'
    END as estado_password,
    rol
FROM usuarios 
WHERE rol = 'admin';
