-- ============================================
-- ELIMINAR TODAS LAS TABLAS EXISTENTES
-- Ejecutar ANTES del script principal
-- ============================================

-- Eliminar tablas en orden inverso de dependencia para evitar errores de clave foránea
DROP TABLE IF EXISTS contacto_mensajes CASCADE;
DROP TABLE IF EXISTS horarios_doctores CASCADE;
DROP TABLE IF EXISTS citas CASCADE;
DROP TABLE IF EXISTS medicamentos CASCADE;
DROP TABLE IF EXISTS doctores CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS especialidades CASCADE;
DROP TABLE IF EXISTS sedes CASCADE;
DROP TABLE IF EXISTS administradores CASCADE;

-- Eliminar funciones y triggers si existen
DROP FUNCTION IF EXISTS actualizar_updated_at() CASCADE;

-- Verificar que se eliminaron todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Si la consulta anterior devuelve filas, significa que aún hay tablas
-- Si no devuelve nada, todas las tablas se eliminaron correctamente