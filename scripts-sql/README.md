# 📋 SCRIPTS SQL - CLÍNICA MONTELUZ

## 📁 Archivos en esta carpeta:

### 1. `01-database-schema.sql` 🏗️
- **Propósito:** Crear toda la estructura de la base de datos
- **Contiene:** 9 tablas, índices, triggers, funciones, políticas de seguridad
- **Datos iniciales:** 8 especialidades médicas
- **Ejecutar:** PRIMERO

### 2. `02-crear-admin.sql` 👑
- **Propósito:** Crear el administrador principal del sistema
- **Credenciales:** 
  - Email: `admin@monteluz.com`
  - Contraseña: `admin123`
- **Ejecutar:** SEGUNDO (después del schema)

### 3. `03-verificar-sistema.sql` ✅
- **Propósito:** Verificar que todo el sistema funciona correctamente
- **Muestra:** Tablas creadas, administrador, especialidades, estructura
- **Ejecutar:** TERCERO (para verificar)

---

## 🚀 ORDEN DE EJECUCIÓN:

```
1️⃣ Ejecutar: 01-database-schema.sql
2️⃣ Ejecutar: 02-crear-admin.sql  
3️⃣ Ejecutar: 03-verificar-sistema.sql
```

---

## 📊 TABLAS CREADAS:

1. **`usuarios`** - Usuarios del sistema (pacientes, doctores, admin)
2. **`especialidades`** - Especialidades médicas (8 predefinidas)
3. **`doctores`** - Información específica de doctores
4. **`pacientes`** - Información específica de pacientes
5. **`sedes`** - Sedes de la clínica
6. **`servicios`** - Servicios médicos ofrecidos
7. **`citas`** - Gestión de citas médicas
8. **`horarios_doctores`** - Horarios de atención
9. **`contacto_mensajes`** - Mensajes del formulario de contacto

---

## 🔐 CREDENCIALES DE ADMINISTRADOR:

```
Email: admin@monteluz.com
Contraseña: admin123
```

---

## ⚠️ IMPORTANTE:

- Ejecutar los scripts en el **SQL Editor de Supabase**
- Ejecutar en el **orden correcto** (01 → 02 → 03)
- La contraseña está **encriptada con bcrypt**
- El sistema incluye **Row Level Security (RLS)**

---

## ✅ DESPUÉS DE EJECUTAR:

1. **Probar el login:** `http://localhost:4200/login-admin`
2. **Credenciales:** `admin@monteluz.com` / `admin123`
3. **Verificar redirección** al dashboard
4. **Backend funcionando** en puerto 3001
