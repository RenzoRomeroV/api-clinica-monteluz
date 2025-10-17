# Scripts SQL - Clínica Monteluz

Este directorio contiene los scripts SQL necesarios para configurar la base de datos de la Clínica Monteluz.

## 📁 Archivos

### 1. `00-eliminar-tablas.sql`
**Propósito:** Eliminar todas las tablas existentes antes de crear el esquema nuevo.
**Cuándo usar:** Antes de ejecutar el script principal de base de datos.
**Contenido:**
- Elimina todas las tablas en orden inverso de dependencia
- Elimina funciones y triggers
- Verifica que se eliminaron todas las tablas

### 2. `01-database-completo.sql`
**Propósito:** Crear el esquema completo de la base de datos.
**Cuándo usar:** Después de eliminar las tablas existentes.
**Contenido:**
- Creación de todas las tablas
- Índices para optimización
- Foreign keys
- Triggers para updated_at
- Políticas de seguridad (RLS)

### 3. `02-datos-iniciales.sql`
**Propósito:** Insertar datos iniciales para el funcionamiento del sistema.
**Cuándo usar:** Después de crear el esquema de base de datos.
**Contenido:**
- Especialidades médicas
- Administrador principal
- Sedes de la clínica
- Medicamentos de ejemplo
- Doctores de ejemplo
- Pacientes de ejemplo
- Horarios de doctores
- Citas de ejemplo

### 4. `03-verificar-sistema.sql`
**Propósito:** Verificar que todo el sistema esté funcionando correctamente.
**Cuándo usar:** Después de insertar los datos iniciales.
**Contenido:**
- Verificación de tablas creadas
- Verificación de datos insertados
- Verificación de funciones y triggers
- Verificación de índices
- Verificación de políticas RLS
- Resumen de datos

## 🚀 Orden de Ejecución

1. **`00-eliminar-tablas.sql`** - Limpiar base de datos
2. **`01-database-completo.sql`** - Crear esquema
3. **`02-datos-iniciales.sql`** - Insertar datos
4. **`03-verificar-sistema.sql`** - Verificar funcionamiento

## 🔑 Credenciales por Defecto

### Administrador
- **Email:** `admin@monteluz.com`
- **Contraseña:** `admin123`

### Doctores
- **Email:** `carlos.mendoza@monteluz.com`
- **Contraseña:** `doctor123`
- **Email:** `ana.garcia@monteluz.com`
- **Contraseña:** `doctor123`

### Pacientes
- **Email:** `juan.perez@example.com`
- **Contraseña:** `paciente123`
- **Email:** `maria.gonzalez@example.com`
- **Contraseña:** `paciente123`

## 📊 Estructura de la Base de Datos

### Tablas Principales
- **administradores** - Administradores del sistema
- **usuarios** - Pacientes registrados
- **doctores** - Médicos de la clínica
- **especialidades** - Especialidades médicas
- **sedes** - Sedes de la clínica
- **medicamentos** - Medicamentos disponibles
- **citas** - Citas médicas
- **horarios_doctores** - Horarios de atención
- **contacto_mensajes** - Mensajes de contacto

### Características
- **IDs:** SERIAL (auto-incrementales)
- **Timestamps:** created_at, updated_at automáticos
- **Triggers:** Actualización automática de updated_at
- **Índices:** Optimización de consultas
- **RLS:** Row Level Security habilitado
- **Validaciones:** CHECK constraints en campos importantes

## ⚠️ Notas Importantes

1. **Ejecutar en orden:** Los scripts deben ejecutarse en el orden indicado
2. **Backup:** Hacer backup antes de ejecutar `00-eliminar-tablas.sql`
3. **Permisos:** Asegurar permisos de administrador en la base de datos
4. **Variables:** Las contraseñas están hasheadas con bcrypt
5. **Conflicto:** Los scripts usan `ON CONFLICT DO NOTHING` para evitar errores

## 🔧 Solución de Problemas

### Error de Foreign Key
- Verificar que las tablas se crean en el orden correcto
- Revisar que los IDs de referencia existan

### Error de Permisos
- Verificar que el usuario tenga permisos de administrador
- Revisar políticas RLS si es necesario

### Error de Datos Duplicados
- Los scripts usan `ON CONFLICT DO NOTHING` para evitar duplicados
- Si hay conflictos, revisar los datos existentes

## 📞 Soporte

Para problemas o dudas sobre los scripts, contactar al equipo de desarrollo.