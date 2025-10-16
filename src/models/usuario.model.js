import { supabase, supabaseAdmin } from '../config/database.js';

/**
 * Modelo de Usuario para operaciones con la base de datos
 */
export class UsuarioModel {
  /**
   * Crear un nuevo usuario
   * @param {Object} usuarioData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  static async create(usuarioData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('usuarios')
        .insert([usuarioData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creando usuario:', error);
        throw new Error(error.message);
      }
      
      return data;
    } catch (error) {
      console.error('Error en UsuarioModel.create:', error);
      throw error;
    }
  }

  /**
   * Buscar usuario por email
   * @param {string} email - Email del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  static async findByEmail(email) {
    try {
      const { data, error } = await supabaseAdmin
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Usuario no encontrado
        }
        console.error('Error buscando usuario por email:', error);
        throw new Error(error.message);
      }
      
      return data;
    } catch (error) {
      console.error('Error en UsuarioModel.findByEmail:', error);
      throw error;
    }
  }

  /**
   * Buscar usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  static async findById(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Usuario no encontrado
        }
        console.error('Error buscando usuario por ID:', error);
        throw new Error(error.message);
      }
      
      return data;
    } catch (error) {
      console.error('Error en UsuarioModel.findById:', error);
      throw error;
    }
  }

  /**
   * Actualizar usuario
   * @param {string} id - ID del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  static async update(id, updateData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('usuarios')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error actualizando usuario:', error);
        throw new Error(error.message);
      }
      
      return data;
    } catch (error) {
      console.error('Error en UsuarioModel.update:', error);
      throw error;
    }
  }

  /**
   * Eliminar usuario (soft delete)
   * @param {string} id - ID del usuario
   * @returns {Promise<boolean>} True si se eliminó correctamente
   */
  static async delete(id) {
    try {
      const { error } = await supabaseAdmin
        .from('usuarios')
        .update({ activo: false })
        .eq('id', id);
      
      if (error) {
        console.error('Error eliminando usuario:', error);
        throw new Error(error.message);
      }
      
      return true;
    } catch (error) {
      console.error('Error en UsuarioModel.delete:', error);
      throw error;
    }
  }

  /**
   * Listar usuarios con paginación
   * @param {Object} options - Opciones de paginación
   * @returns {Promise<Object>} Lista de usuarios
   */
  static async list(options = {}) {
    try {
      const { page = 1, limit = 10, rol = null, activo = true } = options;
      const offset = (page - 1) * limit;
      
      let query = supabaseAdmin
        .from('usuarios')
        .select('*', { count: 'exact' })
        .eq('activo', activo)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });
      
      if (rol) {
        query = query.eq('rol', rol);
      }
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Error listando usuarios:', error);
        throw new Error(error.message);
      }
      
      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      console.error('Error en UsuarioModel.list:', error);
      throw error;
    }
  }

  /**
   * Verificar si el email ya existe
   * @param {string} email - Email a verificar
   * @param {string} excludeId - ID a excluir de la búsqueda
   * @returns {Promise<boolean>} True si el email existe
   */
  static async emailExists(email, excludeId = null) {
    try {
      let query = supabaseAdmin
        .from('usuarios')
        .select('id')
        .eq('email', email);
      
      if (excludeId) {
        query = query.neq('id', excludeId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error verificando email:', error);
        throw new Error(error.message);
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error en UsuarioModel.emailExists:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de usuarios
   * @returns {Promise<Object>} Estadísticas
   */
  static async getStats() {
    try {
      const { data, error } = await supabaseAdmin
        .from('usuarios')
        .select('rol, activo', { count: 'exact' });
      
      if (error) {
        console.error('Error obteniendo estadísticas:', error);
        throw new Error(error.message);
      }
      
      const stats = {
        total: data?.length || 0,
        activos: data?.filter(u => u.activo).length || 0,
        inactivos: data?.filter(u => !u.activo).length || 0,
        porRol: {}
      };
      
      // Contar por rol
      data?.forEach(usuario => {
        if (!stats.porRol[usuario.rol]) {
          stats.porRol[usuario.rol] = 0;
        }
        stats.porRol[usuario.rol]++;
      });
      
      return stats;
    } catch (error) {
      console.error('Error en UsuarioModel.getStats:', error);
      throw error;
    }
  }
}