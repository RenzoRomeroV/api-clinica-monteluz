-- ============================================
-- ELIMINAR TODAS LAS TABLAS EXISTENTES
-- Ejecutar ANTES del script principal
-- ============================================

-- Eliminar tablas en el orden correcto (por dependencias)

-- 1. Eliminar tablas que tienen foreign keys primero
DROP TABLE IF EXISTS citas CASCADE;
DROP TABLE IF EXISTS horarios_doctores CASCADE;
DROP TABLE IF EXISTS horarios_disponibles CASCADE;
DROP TABLE IF EXISTS historial_medico CASCADE;
DROP TABLE IF EXISTS notificaciones CASCADE;

-- 2. Eliminar tablas intermedias
DROP TABLE IF EXISTS doctores CASCADE;
DROP TABLE IF EXISTS pacientes CASCADE;
DROP TABLE IF EXISTS servicios CASCADE;

-- 3. Eliminar tablas principales
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS especialidades CASCADE;
DROP TABLE IF EXISTS sedes CASCADE;

-- 4. Eliminar tablas adicionales
DROP TABLE IF EXISTS contacto_mensajes CASCADE;
DROP TABLE IF EXISTS configuracion_sistema CASCADE;

-- 5. Eliminar funciones y triggers si existen
DROP FUNCTION IF EXISTS actualizar_updated_at() CASCADE;

-- 6. Verificar que se eliminaron todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Si la consulta anterior devuelve filas, significa que aún hay tablas
-- Si no devuelve nada, todas las tablas se eliminaron correctamente
