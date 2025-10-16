-- ============================================
-- CREAR ADMINISTRADOR PRINCIPAL
-- Ejecutar DESPUÉS del 01-database-schema.sql
-- ============================================

-- Insertar administrador principal
INSERT INTO usuarios (
    email,
    password,
    nombre,
    apellido,
    telefono,
    rol,
    activo
) VALUES (
    'admin@monteluz.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: admin123
    'Administrador',
    'Principal',
    '987654321',
    'admin',
    true
);

-- Verificar que se insertó correctamente
SELECT 
    id, 
    email, 
    nombre, 
    apellido, 
    rol, 
    activo, 
    created_at 
FROM usuarios 
WHERE email = 'admin@monteluz.com';

-- Mostrar información del administrador creado
SELECT 
    '✅ Administrador creado exitosamente' as status,
    email,
    nombre || ' ' || apellido as nombre_completo,
    rol,
    CASE WHEN activo THEN 'Activo' ELSE 'Inactivo' END as estado
FROM usuarios 
WHERE rol = 'admin';
