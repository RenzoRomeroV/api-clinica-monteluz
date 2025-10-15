/**
 * Modelo de Usuario
 * 
 * Estructura de la tabla 'usuarios' en Supabase:
 * 
 * - id (uuid, primary key)
 * - email (text, unique)
 * - password (text)
 * - nombre (text)
 * - apellido (text)
 * - telefono (text)
 * - rol (text) - 'paciente', 'doctor', 'admin', 'recepcionista'
 * - activo (boolean)
 * - created_at (timestamp)
 * - updated_at (timestamp)
 */

export const UsuarioModel = {
  tableName: 'usuarios',
  
  roles: {
    PACIENTE: 'paciente',
    DOCTOR: 'doctor',
    ADMIN: 'admin',
    RECEPCIONISTA: 'recepcionista'
  },

  // Campos que se pueden seleccionar públicamente (sin password)
  camposPublicos: 'id, email, nombre, apellido, telefono, rol, activo, created_at',

  // Validaciones
  validaciones: {
    email: {
      required: true,
      type: 'email'
    },
    password: {
      required: true,
      minLength: 6
    },
    nombre: {
      required: true,
      minLength: 2
    },
    apellido: {
      required: true,
      minLength: 2
    },
    rol: {
      required: true,
      enum: ['paciente', 'doctor', 'admin', 'recepcionista']
    }
  }
};

export default UsuarioModel;


