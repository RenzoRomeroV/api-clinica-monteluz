# 🚀 Inicio Rápido - API Clínica Monteluz

Guía rápida para poner en marcha el backend en 5 minutos.

## ⚡ Pasos Rápidos

### 1. Instalar Dependencias
```bash
cd api-monteluz
npm install
```

### 2. Configurar Variables de Entorno
```bash
# Copia el archivo de ejemplo
copy env.example .env

# Edita .env y completa:
# - SUPABASE_URL
# - SUPABASE_KEY
# - JWT_SECRET (cualquier string largo y aleatorio)
```

### 3. Configurar Base de Datos
- Sigue las instrucciones en `SUPABASE-SETUP.md`
- Ejecuta el script `database-schema.sql` en Supabase

### 4. Iniciar Servidor
```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

### 5. Verificar que Funciona
Abre tu navegador en: `http://localhost:3000`

Deberías ver:
```json
{
  "message": "🏥 API Clínica Monteluz - Funcionando correctamente",
  "version": "1.0.0",
  "status": "OK"
}
```

## 📋 Checklist de Configuración

- [ ] Node.js instalado (v18+)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` creado y configurado
- [ ] Proyecto de Supabase creado
- [ ] Tablas creadas en Supabase
- [ ] Servidor corriendo sin errores

## 🔧 Comandos Útiles

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Producción
npm start

# Ver estructura del proyecto
tree /F /A
```

## 🌐 Endpoints Disponibles

### Prueba
- `GET /` - Verificar que la API funciona

### Autenticación (por implementar)
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/verify` - Verificar token

### Citas (por implementar)
- `GET /api/citas` - Listar citas
- `POST /api/citas` - Crear cita
- `GET /api/citas/:id` - Ver cita
- `PUT /api/citas/:id` - Actualizar cita
- `DELETE /api/citas/:id` - Eliminar cita

## 🐛 Solución Rápida de Problemas

### Puerto 3000 en uso
```bash
# Cambiar puerto en .env
PORT=3001
```

### Error de conexión a Supabase
1. Verifica que `SUPABASE_URL` y `SUPABASE_KEY` sean correctos
2. Confirma que el proyecto de Supabase esté activo
3. Revisa tu conexión a internet

### Módulos no encontrados
```bash
npm install
```

## 📱 Conectar con el Frontend

En tu frontend Angular (`web-monteluz`):

```typescript
// environment.ts
export const environment = {
  apiUrl: 'http://localhost:3000/api'
};
```

## 🚀 Siguiente Paso

Una vez que el backend esté funcionando:
1. Implementa los controladores
2. Prueba los endpoints con Postman
3. Conecta con el frontend Angular
4. Despliega en Vercel

## 📚 Documentación Completa

- `README.md` - Documentación completa
- `SUPABASE-SETUP.md` - Configuración de base de datos
- `database-schema.sql` - Schema de la base de datos

---

**¿Todo listo?** ¡Comienza a desarrollar! 🎉


