# 🏥 API Clínica Monteluz

Backend API para el sistema de gestión de Clínica Monteluz, desarrollado con Node.js, Express y Supabase (PostgreSQL).

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Cuenta de Supabase
- PostgreSQL (a través de Supabase)

## 🚀 Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
   - Copia el archivo `env.example` y renómbralo a `.env`
   - Completa las variables con tus credenciales:
     - SUPABASE_URL
     - SUPABASE_KEY
     - JWT_SECRET
     - etc.

3. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

4. **Iniciar servidor de producción:**
```bash
npm start
```

## 📁 Estructura del Proyecto

```
api-monteluz/
├── src/
│   ├── controllers/      # Lógica de negocio
│   ├── models/          # Modelos de datos
│   ├── routes/          # Definición de rutas
│   ├── middleware/      # Middlewares (auth, validación)
│   ├── services/        # Servicios externos
│   ├── config/          # Configuración (DB, etc.)
│   ├── utils/           # Utilidades (JWT, bcrypt, etc.)
│   └── index.js         # Punto de entrada
├── package.json
├── env.example
└── README.md
```

## 🔌 Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/verify` - Verificar token

### Citas
- `GET /api/citas` - Listar citas
- `POST /api/citas` - Crear cita
- `GET /api/citas/:id` - Obtener cita
- `PUT /api/citas/:id` - Actualizar cita
- `DELETE /api/citas/:id` - Eliminar cita

### Usuarios
- `GET /api/usuarios` - Listar usuarios
- `POST /api/usuarios` - Crear usuario
- `GET /api/usuarios/:id` - Obtener usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

### Servicios
- `GET /api/servicios` - Listar servicios
- `POST /api/servicios` - Crear servicio
- `GET /api/servicios/:id` - Obtener servicio
- `PUT /api/servicios/:id` - Actualizar servicio
- `DELETE /api/servicios/:id` - Eliminar servicio

### Sedes
- `GET /api/sedes` - Listar sedes
- `POST /api/sedes` - Crear sede
- `GET /api/sedes/:id` - Obtener sede
- `PUT /api/sedes/:id` - Actualizar sede
- `DELETE /api/sedes/:id` - Eliminar sede

### Contacto
- `POST /api/contacto` - Enviar mensaje de contacto

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Para acceder a rutas protegidas, incluye el token en el header:

```
Authorization: Bearer <tu_token>
```

## 🗄️ Base de Datos (Supabase)

### Tablas principales:
- `usuarios` - Información de usuarios
- `citas` - Gestión de citas médicas
- `servicios` - Servicios médicos ofrecidos
- `especialidades` - Especialidades médicas
- `sedes` - Sedes de la clínica
- `doctores` - Información de doctores
- `pacientes` - Información de pacientes

## 🌐 Despliegue en Vercel

1. Instalar Vercel CLI:
```bash
npm install -g vercel
```

2. Desplegar:
```bash
vercel
```

3. Configurar variables de entorno en el dashboard de Vercel

## 📦 Dependencias Principales

- **express** - Framework web
- **@supabase/supabase-js** - Cliente de Supabase
- **jsonwebtoken** - Autenticación JWT
- **bcryptjs** - Encriptación de contraseñas
- **cors** - Manejo de CORS
- **dotenv** - Variables de entorno
- **express-validator** - Validación de datos
- **nodemailer** - Envío de emails

## 👨‍💻 Desarrollo

### Scripts disponibles:
- `npm start` - Iniciar servidor
- `npm run dev` - Iniciar servidor con nodemon (auto-reload)

## 📝 Notas

- El puerto por defecto es 3000
- Asegúrate de configurar correctamente las variables de entorno
- Para producción, usa HTTPS
- Mantén tu JWT_SECRET seguro y nunca lo compartas

## 🤝 Contribución

Este es un proyecto privado de Clínica Monteluz.

## 📄 Licencia

ISC

---

**Desarrollado con ❤️ para Clínica Monteluz**


