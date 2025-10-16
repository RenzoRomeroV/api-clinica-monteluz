# 🔧 Configuración de Supabase

## Pasos para configurar Supabase correctamente:

### 1. Acceder a Supabase
- Ve a [https://supabase.com](https://supabase.com)
- Inicia sesión en tu cuenta
- Selecciona tu proyecto "clinica-monteluz"

### 2. Obtener las claves de API
- Ve a **Settings** > **API**
- Copia la **URL** del proyecto
- Copia la **anon public** key
- Copia la **service_role** key (si está disponible)

### 3. Actualizar el archivo config.env
Reemplaza las siguientes líneas en `config.env`:

```env
SUPABASE_URL=tu_url_aqui
SUPABASE_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_KEY=tu_service_role_key_aqui
```

### 4. Ejecutar el script de configuración
```bash
node setup-database.js
```

### 5. Probar el servidor
```bash
npm run dev
```

## Estructura de la base de datos

El proyecto ya tiene el esquema de base de datos configurado en `database-schema.sql`. Las tablas incluyen:

- `usuarios` - Usuarios del sistema
- `especialidades` - Especialidades médicas
- `doctores` - Información de doctores
- `pacientes` - Información de pacientes
- `sedes` - Sedes de la clínica
- `servicios` - Servicios médicos
- `citas` - Citas médicas
- `horarios_doctores` - Horarios de atención
- `contacto_mensajes` - Mensajes de contacto

## Credenciales de prueba

Una vez configurado, podrás usar:
- **Email:** admin@monteluz.com
- **Password:** admin123
