/**
 * Modelo de Cita
 * 
 * Estructura de la tabla 'citas' en Supabase:
 * 
 * - id (uuid, primary key)
 * - paciente_id (uuid, foreign key -> usuarios)
 * - doctor_id (uuid, foreign key -> usuarios)
 * - servicio_id (uuid, foreign key -> servicios)
 * - sede_id (uuid, foreign key -> sedes)
 * - fecha (date)
 * - hora (time)
 * - estado (text) - 'pendiente', 'confirmada', 'cancelada', 'completada'
 * - motivo (text)
 * - notas (text)
 * - created_at (timestamp)
 * - updated_at (timestamp)
 */

export const CitaModel = {
  tableName: 'citas',
  
  estados: {
    PENDIENTE: 'pendiente',
    CONFIRMADA: 'confirmada',
    CANCELADA: 'cancelada',
    COMPLETADA: 'completada'
  },

  // Campos que se pueden seleccionar
  camposCompletos: `
    id,
    fecha,
    hora,
    estado,
    motivo,
    notas,
    created_at,
    paciente:paciente_id (id, nombre, apellido, email, telefono),
    doctor:doctor_id (id, nombre, apellido, email),
    servicio:servicio_id (id, nombre, descripcion, duracion),
    sede:sede_id (id, nombre, direccion)
  `,

  // Validaciones
  validaciones: {
    paciente_id: {
      required: true,
      type: 'uuid'
    },
    doctor_id: {
      required: true,
      type: 'uuid'
    },
    servicio_id: {
      required: true,
      type: 'uuid'
    },
    fecha: {
      required: true,
      type: 'date'
    },
    hora: {
      required: true,
      type: 'time'
    },
    estado: {
      required: true,
      enum: ['pendiente', 'confirmada', 'cancelada', 'completada']
    }
  }
};

export default CitaModel;


