-- Crear credencial de administrador principal
-- Insertar administrador principal
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
    activo
) VALUES (
    '12345678',
    'RENZO',
    'ROMERO',
    'VALVERDE',
    '2003-03-24',
    'Masculino',
    'renzoromerov42@gmail.com',
    '987654321',
    '\\\.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'administrador',
    'ADM001',
    'Super Administrador',
    'super-admin',
    true
);
