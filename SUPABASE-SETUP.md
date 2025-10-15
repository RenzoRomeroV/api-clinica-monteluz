# 🗄️ Configuración de Supabase para Clínica Monteluz

Esta guía te ayudará a configurar la base de datos en Supabase para el sistema de Clínica Monteluz.

## 📋 Pasos para Configurar Supabase

### 1. Crear Cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Crear Nuevo Proyecto

1. Click en "New Project"
2. Completa los datos:
   - **Name**: Clinica-Monteluz
   - **Database Password**: (guarda esta contraseña de forma segura)
   - **Region**: Selecciona la más cercana a tu ubicación
3. Click en "Create new project"
4. Espera unos minutos mientras se crea el proyecto

### 3. Obtener Credenciales

Una vez creado el proyecto:

1. Ve a **Settings** → **API**
2. Copia los siguientes valores:
   - **Project URL** → Esta es tu `SUPABASE_URL`
   - **anon public** key → Esta es tu `SUPABASE_KEY`
   - **service_role** key → Esta es tu `SUPABASE_SERVICE_KEY` (¡NO compartir!)

### 4. Crear las Tablas

1. Ve a **SQL Editor** en el panel izquierdo
2. Click en "New query"
3. Copia y pega el contenido del archivo `database-schema.sql`
4. Click en "Run" para ejecutar el script
5. Verifica que todas las tablas se crearon correctamente en la sección **Table Editor**

### 5. Configurar Variables de Entorno

En tu proyecto backend (`api-monteluz`):

1. Crea un archivo `.env` (copia de `env.example`)
2. Completa con tus credenciales de Supabase:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_KEY=tu_service_role_key_aqui
```

### 6. Verificar Conexión

Ejecuta el servidor backend:

```bash
cd api-monteluz
npm install
npm run dev
```

Si todo está bien configurado, verás:
```
✅ Conexión a Supabase establecida correctamente
🚀 Servidor corriendo en puerto 3000
```

## 📊 Estructura de Tablas Creadas

- ✅ **usuarios** - Usuarios del sistema (pacientes, doctores, admin)
- ✅ **especialidades** - Especialidades médicas
- ✅ **doctores** - Información de doctores
- ✅ **pacientes** - Información de pacientes
- ✅ **sedes** - Sedes de la clínica
- ✅ **servicios** - Servicios médicos ofrecidos
- ✅ **citas** - Gestión de citas médicas
- ✅ **horarios_doctores** - Horarios de atención
- ✅ **contacto_mensajes** - Mensajes del formulario de contacto

## 🔐 Seguridad

### Row Level Security (RLS)

Supabase tiene habilitado RLS por defecto. Las políticas básicas ya están configuradas en el schema, pero puedes personalizarlas:

1. Ve a **Authentication** → **Policies**
2. Selecciona una tabla
3. Crea o modifica políticas según tus necesidades

### Ejemplo de Políticas:

```sql
-- Los usuarios solo pueden ver su propia información
CREATE POLICY "Ver propia información"
  ON usuarios FOR SELECT
  USING (auth.uid() = id);

-- Los pacientes solo pueden crear sus propias citas
CREATE POLICY "Crear propias citas"
  ON citas FOR INSERT
  WITH CHECK (auth.uid() = paciente_id);
```

## 🔄 Migraciones

Para futuras actualizaciones del schema:

1. Crea un archivo SQL con los cambios
2. Ejecútalo en el SQL Editor de Supabase
3. Documenta los cambios en este archivo

## 📱 Autenticación

Supabase incluye autenticación integrada. Puedes configurar:

1. **Email/Password** (recomendado para inicio)
2. **OAuth** (Google, Facebook, etc.)
3. **Magic Links**

Para configurar:
1. Ve a **Authentication** → **Providers**
2. Habilita los proveedores que desees

## 🚀 Despliegue

### Variables de Entorno en Vercel:

Cuando despliegues el backend en Vercel, agrega estas variables:

```
SUPABASE_URL=tu_url
SUPABASE_KEY=tu_key
SUPABASE_SERVICE_KEY=tu_service_key
JWT_SECRET=tu_jwt_secret
NODE_ENV=production
```

## 📝 Notas Importantes

- ⚠️ **NUNCA** compartas tu `SUPABASE_SERVICE_KEY`
- ⚠️ **NUNCA** subas el archivo `.env` a GitHub
- ✅ Usa `env.example` como plantilla
- ✅ Habilita RLS en producción
- ✅ Configura backups automáticos en Supabase

## 🆘 Solución de Problemas

### Error: "relation does not exist"
- Verifica que ejecutaste el script `database-schema.sql`
- Revisa que todas las tablas se crearon correctamente

### Error: "Invalid API key"
- Verifica que copiaste correctamente las keys de Supabase
- Asegúrate de usar la key correcta (anon vs service_role)

### Error de conexión
- Verifica tu conexión a internet
- Confirma que el proyecto de Supabase está activo
- Revisa que la URL sea correcta

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de PostgreSQL](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**¿Necesitas ayuda?** Consulta la documentación oficial o contacta al equipo de desarrollo.


