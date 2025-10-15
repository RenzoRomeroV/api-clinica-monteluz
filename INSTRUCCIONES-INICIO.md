# 📝 INSTRUCCIONES PARA INICIAR EL BACKEND

## ✅ Estado Actual

- ✅ Carpeta `api-monteluz` creada
- ✅ Estructura de archivos completa
- ✅ Dependencias instaladas (`npm install` completado)
- ⚠️ Falta crear archivo `.env`

---

## 🔧 PASO 1: Crear archivo `.env`

Crea un archivo llamado `.env` en la carpeta `api-monteluz` con el siguiente contenido:

```env
# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Configuración de Supabase
# TODO: Completar con tus credenciales de Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_KEY=tu_service_role_key_aqui

# JWT Secret
JWT_SECRET=clinica_monteluz_secret_key_2024_super_seguro
JWT_EXPIRES_IN=7d

# Configuración de Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_password_de_aplicacion

# CORS
CORS_ORIGIN=http://localhost:4200

# Base de datos
DATABASE_URL=postgresql://usuario:password@host:puerto/database
```

**IMPORTANTE:** Por ahora, puedes dejar los valores de ejemplo. El servidor funcionará sin Supabase para las rutas de prueba.

---

## 🚀 PASO 2: Iniciar el Servidor

Abre una nueva terminal y ejecuta:

```bash
cd api-monteluz
npm run dev
```

Deberías ver:

```
🚀 Servidor corriendo en puerto 3000
📍 URL: http://localhost:3000
🌍 Entorno: development
```

---

## ✅ PASO 3: Verificar que Funciona

Abre tu navegador en: **http://localhost:3000**

Deberías ver:

```json
{
  "message": "🏥 API Clínica Monteluz - Funcionando correctamente",
  "version": "1.0.0",
  "status": "OK"
}
```

---

## 📊 Estado de los Servidores

### Frontend (Angular):
- ✅ Corriendo en: `http://localhost:4200`
- ✅ Puerto: 4200

### Backend (Node.js):
- 🔄 Por iniciar en: `http://localhost:3000`
- 🔄 Puerto: 3000

---

## 📝 Configuración de Supabase (OPCIONAL por ahora)

Si quieres configurar Supabase ahora:

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea un proyecto
3. Ve a **Settings** → **API**
4. Copia las credenciales al archivo `.env`
5. Ve a **SQL Editor**
6. Ejecuta el archivo `database-schema.sql`

**NOTA:** Puedes hacer esto después. El servidor funcionará sin Supabase por ahora.

---

## 🎯 Próximos Pasos

Una vez que el backend esté corriendo:

1. ✅ Frontend funcionando en puerto 4200
2. ✅ Backend funcionando en puerto 3000
3. 🔄 Configurar segunda pestaña (según tus instrucciones)

---

## 📞 ¿Problemas?

### Puerto 3000 en uso:
Cambia el puerto en `.env`:
```env
PORT=3001
```

### Módulos no encontrados:
```bash
npm install
```

### Error al iniciar:
Verifica que el archivo `.env` exista y tenga el formato correcto.

---

**¡Todo listo para continuar con la segunda pestaña!** 🎉


