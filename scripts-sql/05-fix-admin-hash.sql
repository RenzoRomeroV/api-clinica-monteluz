-- ============================================
-- ARREGLAR HASH DEL ADMINISTRADOR
-- Ejecutar directamente en Supabase SQL Editor
-- ============================================

-- Eliminar administrador existente
DELETE FROM administradores WHERE correo = 'admin@monteluz.com';

-- Insertar administrador con hash correcto (generado con bcryptjs 12 rounds)
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
    '$2a$12$hKZwqRlM0/oN5nyzgftVdOJbOoduHVEhqfdt9dKdQovJdV84pwv7e',
    'Av. Principal 123',
    'Lima',
    'Lima',
    'Miraflores',
    '987654321',
    1
);

-- Verificar que se insertó correctamente
SELECT 
    id,
    dni,
    nombre,
    apellidos,
    correo,
    estado,
    created_at
FROM administradores 
WHERE correo = 'admin@monteluz.com';
