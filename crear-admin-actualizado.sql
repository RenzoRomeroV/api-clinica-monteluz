-- Crear credencial de administrador principal
-- Insertar administrador principal con contraseña: "admin123"

INSERT INTO usuarios (
    dni,
    nombre,
    apellido_paterno,
    apellido_materno,
    fecha_nacimiento,
    sexo,
    correo,
    celular,
    password_hash,
    tipo_usuario,
    codigo_admin,
    cargo,
    nivel_acceso,
    activo,
    created_at,
    updated_at
) VALUES (
    '12345678',
    'RENZO',
    'ROMERO',
    'VALVERDE',
    '2003-03-24',
    'Masculino',
    'ADM001@admin.monteluz.com',
    '987654321',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: admin123
    'administrador',
    'ADM001',
    'Super Administrador',
    'super-admin',
    true,
    NOW(),
    NOW()
) ON CONFLICT (correo) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    updated_at = NOW();
