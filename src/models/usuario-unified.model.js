import { supabase } from '../config/database.js';

/**
 * Modelo unificado de Usuario para trabajar con las tablas separadas
 * administradores, usuarios (pacientes), y doctores
 */
export class UsuarioUnifiedModel {
  /**
   * Buscar usuario por email en todas las tablas
   * @param {string} email - Email del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  static async findByEmail(email) {
    try {
      // Buscar en administradores
      const { data: admin, error: adminError } = await supabase
        .from('administradores')
        .select('*')
        .eq('correo', email)
        .eq('estado', 1) // Solo activos
        .single();
      
      if (admin && !adminError) {
        return {
          ...admin,
          tabla: 'administradores',
          rol: 'admin',
          email: admin.correo,
          nombre: admin.nombre,
          apellido: admin.apellidos,
          activo: admin.estado === 1
        };
      }
      
      // Buscar en doctores
      const { data: doctor, error: doctorError } = await supabase
        .from('doctores')
        .select('*')
        .eq('correo', email)
        .eq('activo', true)
        .single();
      
      if (doctor && !doctorError) {
        return {
          ...doctor,
          tabla: 'doctores',
          rol: 'doctor',
          email: doctor.correo,
          nombre: doctor.nombre,
          apellido: doctor.apellidos,
          activo: doctor.activo
        };
      }
      
      // Buscar en usuarios (pacientes)
      const { data: paciente, error: pacienteError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('correo', email)
        .eq('activo', true)
        .single();
      
      if (paciente && !pacienteError) {
        return {
          ...paciente,
          tabla: 'usuarios',
          rol: 'paciente',
          email: paciente.correo,
          nombre: paciente.nombre,
          apellido: paciente.apellidos,
          activo: paciente.activo
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error en UsuarioUnifiedModel.findByEmail:', error);
      throw error;
    }
  }

  /**
   * Buscar usuario por ID en todas las tablas
   * @param {string} id - ID del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  static async findById(id) {
    try {
      // Buscar en administradores
      const { data: admin, error: adminError } = await supabase
        .from('administradores')
        .select('*')
        .eq('id', id)
        .eq('estado', 1)
        .single();
      
      if (admin && !adminError) {
        return {
          ...admin,
          tabla: 'administradores',
          rol: 'admin',
          email: admin.correo,
          nombre: admin.nombre,
          apellido: admin.apellidos,
          activo: admin.estado === 1
        };
      }
      
      // Buscar en doctores
      const { data: doctor, error: doctorError } = await supabase
        .from('doctores')
        .select('*')
        .eq('id', id)
        .eq('activo', true)
        .single();
      
      if (doctor && !doctorError) {
        return {
          ...doctor,
          tabla: 'doctores',
          rol: 'doctor',
          email: doctor.correo,
          nombre: doctor.nombre,
          apellido: doctor.apellidos,
          activo: doctor.activo
        };
      }
      
      // Buscar en usuarios (pacientes)
      const { data: paciente, error: pacienteError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .eq('activo', true)
        .single();
      
      if (paciente && !pacienteError) {
        return {
          ...paciente,
          tabla: 'usuarios',
          rol: 'paciente',
          email: paciente.correo,
          nombre: paciente.nombre,
          apellido: paciente.apellidos,
          activo: paciente.activo
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error en UsuarioUnifiedModel.findById:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo usuario según el rol
   * @param {Object} usuarioData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  static async create(usuarioData) {
    try {
      const { rol, ...data } = usuarioData;
      
      let tabla = '';
      let insertData = {};
      
      switch (rol) {
        case 'admin':
          tabla = 'administradores';
          insertData = {
            dni: data.dni,
            nombre: data.nombre,
            apellidos: data.apellido,
            fecha_nacimiento: data.fecha_nacimiento,
            correo: data.email,
            contraseña: data.password,
            direccion: data.direccion,
            departamento: data.departamento,
            provincia: data.provincia,
            distrito: data.distrito,
            estado: 1
          };
          break;
          
        case 'doctor':
          tabla = 'doctores';
          insertData = {
            dni: data.dni,
            nombre: data.nombre,
            apellidos: data.apellido,
            fecha_nacimiento: data.fecha_nacimiento,
            genero: data.genero,
            correo: data.email,
            telefono: data.telefono,
            contraseña: data.password,
            numero_colegiatura: data.numero_colegiatura,
            especialidad_id: data.especialidad_id,
            biografia: data.biografia,
            años_experiencia: data.años_experiencia,
            activo: true
          };
          break;
          
        case 'paciente':
          tabla = 'usuarios';
          insertData = {
            dni: data.dni,
            nombre: data.nombre,
            apellidos: data.apellido,
            fecha_nacimiento: data.fecha_nacimiento,
            genero: data.genero,
            correo: data.email,
            telefono: data.telefono,
            contraseña: data.password,
            direccion: data.direccion,
            departamento: data.departamento,
            provincia: data.provincia,
            distrito: data.distrito,
            tipo_sangre: data.tipo_sangre,
            alergias: data.alergias,
            condiciones_medicas: data.condiciones_medicas,
            contacto_emergencia_nombre: data.contacto_emergencia_nombre,
            contacto_emergencia_telefono: data.contacto_emergencia_telefono,
            activo: true
          };
          break;
          
        default:
          throw new Error('Rol no válido');
      }
      
      const { data: newUser, error } = await supabase
        .from(tabla)
        .insert([insertData])
        .select()
        .single();
      
      if (error) {
        console.error(`Error creando usuario en ${tabla}:`, error);
        throw new Error(error.message);
      }
      
      return {
        ...newUser,
        tabla,
        rol,
        email: newUser.correo,
        nombre: newUser.nombre,
        apellido: newUser.apellidos,
        activo: newUser.activo || newUser.estado === 1
      };
      
    } catch (error) {
      console.error('Error en UsuarioUnifiedModel.create:', error);
      throw error;
    }
  }

  /**
   * Actualizar usuario según su tabla
   * @param {string} id - ID del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  static async update(id, updateData) {
    try {
      // Primero necesitamos saber en qué tabla está el usuario
      const usuario = await this.findById(id);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      
      const { tabla } = usuario;
      let updateFields = {};
      
      // Mapear campos según la tabla
      if (updateData.nombre) updateFields.nombre = updateData.nombre;
      if (updateData.apellido) updateFields.apellidos = updateData.apellido;
      if (updateData.telefono) updateFields.telefono = updateData.telefono;
      if (updateData.password) updateFields.contraseña = updateData.password;
      
      // Campos específicos por tabla
      if (tabla === 'administradores') {
        if (updateData.direccion) updateFields.direccion = updateData.direccion;
        if (updateData.departamento) updateFields.departamento = updateData.departamento;
        if (updateData.provincia) updateFields.provincia = updateData.provincia;
        if (updateData.distrito) updateFields.distrito = updateData.distrito;
      }
      
      if (tabla === 'doctores') {
        if (updateData.numero_colegiatura) updateFields.numero_colegiatura = updateData.numero_colegiatura;
        if (updateData.especialidad_id) updateFields.especialidad_id = updateData.especialidad_id;
        if (updateData.biografia) updateFields.biografia = updateData.biografia;
        if (updateData.años_experiencia) updateFields.años_experiencia = updateData.años_experiencia;
      }
      
      if (tabla === 'usuarios') {
        if (updateData.direccion) updateFields.direccion = updateData.direccion;
        if (updateData.departamento) updateFields.departamento = updateData.departamento;
        if (updateData.provincia) updateFields.provincia = updateData.provincia;
        if (updateData.distrito) updateFields.distrito = updateData.distrito;
        if (updateData.tipo_sangre) updateFields.tipo_sangre = updateData.tipo_sangre;
        if (updateData.alergias) updateFields.alergias = updateData.alergias;
        if (updateData.condiciones_medicas) updateFields.condiciones_medicas = updateData.condiciones_medicas;
      }
      
      const { data: updatedUser, error } = await supabase
        .from(tabla)
        .update(updateFields)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error(`Error actualizando usuario en ${tabla}:`, error);
        throw new Error(error.message);
      }
      
      return {
        ...updatedUser,
        tabla,
        rol: usuario.rol,
        email: updatedUser.correo,
        nombre: updatedUser.nombre,
        apellido: updatedUser.apellidos,
        activo: updatedUser.activo || updatedUser.estado === 1
      };
      
    } catch (error) {
      console.error('Error en UsuarioUnifiedModel.update:', error);
      throw error;
    }
  }

  /**
   * Verificar si el email ya existe en cualquier tabla
   * @param {string} email - Email a verificar
   * @param {string} excludeId - ID a excluir de la búsqueda
   * @returns {Promise<boolean>} True si el email existe
   */
  static async emailExists(email, excludeId = null) {
    try {
      // Verificar en administradores
      let query = supabase
        .from('administradores')
        .select('id')
        .eq('correo', email);
      
      if (excludeId) {
        query = query.neq('id', excludeId);
      }
      
      const { data: adminData } = await query;
      if (adminData && adminData.length > 0) return true;
      
      // Verificar en doctores
      query = supabase
        .from('doctores')
        .select('id')
        .eq('correo', email);
      
      if (excludeId) {
        query = query.neq('id', excludeId);
      }
      
      const { data: doctorData } = await query;
      if (doctorData && doctorData.length > 0) return true;
      
      // Verificar en usuarios
      query = supabase
        .from('usuarios')
        .select('id')
        .eq('correo', email);
      
      if (excludeId) {
        query = query.neq('id', excludeId);
      }
      
      const { data: userData } = await query;
      return userData && userData.length > 0;
      
    } catch (error) {
      console.error('Error en UsuarioUnifiedModel.emailExists:', error);
      throw error;
    }
  }
}
