# 🏥 API Clínica Monteluz - Backend Reconstruido

## 📋 Descripción

Backend completamente reconstruido para el sistema de gestión de la Clínica Monteluz. Desarrollado con Node.js, Express, JWT y Supabase.

## 🚀 Características

- ✅ **Autenticación robusta** con JWT y bcrypt
- ✅ **Validación de datos** con express-validator
- ✅ **Seguridad avanzada** con helmet y rate limiting
- ✅ **CORS configurado** para frontend Angular
- ✅ **Manejo de errores** completo
- ✅ **Logging** con morgan
- ✅ **Base de datos** Supabase PostgreSQL
- ✅ **Despliegue** en Vercel

## 🛠️ Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **JWT** - Autenticación con tokens
- **bcryptjs** - Encriptación de contraseñas
- **Supabase** - Base de datos PostgreSQL
- **express-validator** - Validación de datos
- **helmet** - Seguridad HTTP
- **cors** - Configuración CORS
- **morgan** - Logging HTTP

## 📦 Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd api-monteluz
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copia `env.example` a `.env` y configura las variables:

```env
NODE_ENV=development
PORT=3000
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_clave_anon_de_supabase
SUPABASE_SERVICE_KEY=tu_clave_service_role_de_supabase
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:4200
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Configurar Supabase
1. Ve a [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Ejecuta el script SQL en `database-schema.sql`
4. Obtén las claves de API desde Settings > API

### 5. Ejecutar el servidor

#### Desarrollo (con nodemon)
```bash
npm run dev
```

#### Producción
```bash
npm start
```

#### Servidor Mock (para pruebas sin Supabase)
```bash
node mock-server.js
```

## 🧪 Pruebas

### Usuarios de prueba
- **Admin:** admin@monteluz.com / admin123
- **Doctor:** doctor@monteluz.com / admin123
- **Paciente:** paciente@monteluz.com / admin123

### Ejecutar pruebas de integración
```bash
node test-integration.js
```

## 📚 API Endpoints

### Autenticación

#### POST /api/auth/login
Iniciar sesión
```json
{
  "email": "admin@monteluz.com",
  "password": "admin123"
}
```

#### POST /api/auth/register
Registrar nuevo usuario
```json
{
  "email": "nuevo@email.com",
  "password": "password123",
  "nombre": "Nombre",
  "apellido": "Apellido",
  "telefono": "999999999",
  "rol": "paciente"
}
```

#### POST /api/auth/verify
Verificar token JWT
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### GET /api/auth/profile
Obtener perfil del usuario autenticado
```
Headers: Authorization: Bearer <token>
```

#### PUT /api/auth/profile
Actualizar perfil del usuario autenticado
```
Headers: Authorization: Bearer <token>
Body: {
  "nombre": "Nuevo Nombre",
  "apellido": "Nuevo Apellido",
  "telefono": "999999999"
}
```

#### POST /api/auth/change-password
Cambiar contraseña
```
Headers: Authorization: Bearer <token>
Body: {
  "currentPassword": "password_actual",
  "newPassword": "nueva_password"
}
```

#### POST /api/auth/logout
Cerrar sesión
```
Headers: Authorization: Bearer <token>
```

### Utilidades

#### GET /
Información del servidor y estado de la base de datos

#### GET /health
Estado de salud del servidor

#### GET /api/auth/test
Probar conexión con el servidor

## 🔧 Configuración de Desarrollo

### Estructura del proyecto
```
api-monteluz/
├── src/
│   ├── config/          # Configuración de base de datos
│   ├── controllers/     # Controladores de la API
│   ├── middleware/      # Middlewares personalizados
│   ├── models/          # Modelos de datos
│   ├── routes/          # Rutas de la API
│   ├── services/        # Servicios de negocio
│   ├── utils/           # Utilidades (JWT, bcrypt)
│   └── validators/      # Validadores de datos
├── api/                 # Archivo de entrada para Vercel
├── vercel.json          # Configuración de Vercel
└── package.json
```

### Variables de entorno requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NODE_ENV` | Entorno de ejecución | `development` |
| `PORT` | Puerto del servidor | `3000` |
| `SUPABASE_URL` | URL de Supabase | `https://xxx.supabase.co` |
| `SUPABASE_KEY` | Clave anónima de Supabase | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_KEY` | Clave de servicio de Supabase | `eyJhbGciOiJIUzI1NiIs...` |
| `JWT_SECRET` | Secreto para JWT | `mi-secreto-super-seguro` |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `24h` |
| `CORS_ORIGIN` | Origen permitido para CORS | `http://localhost:4200` |

## 🚀 Despliegue en Vercel

### 1. Configurar Vercel
```bash
npm install -g vercel
vercel login
vercel
```

### 2. Configurar variables de entorno en Vercel
```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_KEY
vercel env add SUPABASE_SERVICE_KEY
vercel env add JWT_SECRET
```

### 3. Desplegar
```bash
vercel --prod
```

## 🔒 Seguridad

- ✅ **HTTPS** en producción
- ✅ **Rate limiting** para prevenir ataques
- ✅ **Helmet** para headers de seguridad
- ✅ **CORS** configurado correctamente
- ✅ **Validación** de todos los inputs
- ✅ **Encriptación** de contraseñas con bcrypt
- ✅ **Tokens JWT** con expiración
- ✅ **Sanitización** de datos

## 📝 Logs

El servidor incluye logging completo:
- **Desarrollo:** Logs detallados con morgan
- **Producción:** Logs de errores y acceso
- **Base de datos:** Logs de conexión y errores

## 🐛 Solución de problemas

### Error de conexión a Supabase
1. Verifica que las variables de entorno estén configuradas
2. Confirma que las claves de API sean correctas
3. Verifica que el proyecto de Supabase esté activo

### Error de CORS
1. Verifica que `CORS_ORIGIN` esté configurado correctamente
2. Confirma que el frontend esté en el origen permitido

### Error de JWT
1. Verifica que `JWT_SECRET` esté configurado
2. Confirma que el token no haya expirado

## 📞 Soporte

Para soporte técnico o preguntas:
- 📧 Email: soporte@monteluz.com
- 📱 Teléfono: +51 999 999 999
- 🌐 Web: https://monteluz.com

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ para Clínica Monteluz**