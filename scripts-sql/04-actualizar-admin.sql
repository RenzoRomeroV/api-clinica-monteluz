-- ============================================
-- ACTUALIZAR ADMINISTRADOR - CLÍNICA MONTELUZ
-- Script para actualizar el hash de la contraseña del administrador
-- ============================================

-- Eliminar administrador existente si existe
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
    '$2a$12$N2QJ.L.MZgYPCwe7km0LOutBWtU6lsdoig32kanPxV72ja9wB8cAC', -- Hash generado con bcryptjs 12 rounds para 'admin123'
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
