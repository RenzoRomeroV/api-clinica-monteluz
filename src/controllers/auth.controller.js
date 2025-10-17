import { UsuarioUnifiedModel } from '../models/usuario-unified.model.js';
import { generateToken, verifyToken } from '../utils/jwt.js';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/bcrypt.js';

/**
 * Controlador de autenticación
 */
export class AuthController {
  /**
   * Iniciar sesión
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Buscar usuario por email
      const usuario = await UsuarioUnifiedModel.findByEmail(email);
      
      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
      
      if (!usuario.activo) {
        return res.status(401).json({
          success: false,
          message: 'Usuario inactivo'
        });
      }
      
      // Verificar contraseña
      const passwordValid = await comparePassword(password, usuario.contraseña);
      
      if (!passwordValid) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
      
      // Generar token JWT
      const token = generateToken({
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol
      });
      
      // Preparar respuesta (sin contraseña)
      const usuarioResponse = {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol,
        telefono: usuario.telefono,
        created_at: usuario.created_at
      };
      
      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        token,
        usuario: usuarioResponse
      });
      
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Iniciar sesión como administrador
   */
  static async loginAdmin(req, res) {
    try {
      console.log('🔍 Debug - loginAdmin iniciado');
      const { email, password } = req.body;
      console.log('🔍 Debug - email recibido:', email);
      
      // Buscar usuario por email
      console.log('🔍 Debug - buscando usuario en BD...');
      const usuario = await UsuarioUnifiedModel.findByEmail(email);
      console.log('🔍 Debug - usuario encontrado:', usuario ? 'Sí' : 'No');
      
      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
      
      // Verificar que sea administrador
      if (usuario.rol !== 'admin') {
        return res.status(401).json({
          success: false,
          message: 'Acceso denegado. Se requiere rol de administrador'
        });
      }
      
      if (!usuario.activo) {
        return res.status(401).json({
          success: false,
          message: 'Usuario inactivo'
        });
      }
      
      // Verificar contraseña
      const passwordValid = await comparePassword(password, usuario.contraseña);
      
      if (!passwordValid) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
      
      // Generar token JWT
      const token = generateToken({
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol
      });
      
      // Preparar respuesta (sin contraseña)
      const usuarioResponse = {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol,
        telefono: usuario.telefono,
        created_at: usuario.created_at
      };
      
      res.json({
        success: true,
        message: 'Inicio de sesión de administrador exitoso',
        token,
        usuario: usuarioResponse
      });
      
    } catch (error) {
      console.error('Error en loginAdmin:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Registrar nuevo usuario
   */
  static async register(req, res) {
    try {
      const { email, password, nombre, apellido, telefono, rol } = req.body;
      
      // Validar fortaleza de contraseña
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Contraseña inválida',
          errors: passwordValidation.errors
        });
      }
      
      // Verificar si el email ya existe
      const emailExists = await UsuarioUnifiedModel.emailExists(email);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado'
        });
      }
      
      // Encriptar contraseña
      const hashedPassword = await hashPassword(password);
      
      // Crear usuario según el rol
      const usuarioData = {
        email,
        password: hashedPassword,
        nombre,
        apellido,
        telefono: telefono || null,
        rol: rol || 'paciente',
        // Campos adicionales según el rol
        dni: req.body.dni || '00000000',
        fecha_nacimiento: req.body.fecha_nacimiento || '1990-01-01',
        genero: req.body.genero || 'otro'
      };
      
      const nuevoUsuario = await UsuarioUnifiedModel.create(usuarioData);
      
      // Generar token JWT
      const token = generateToken({
        id: nuevoUsuario.id,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      });
      
      // Preparar respuesta (sin contraseña)
      const usuarioResponse = {
        id: nuevoUsuario.id,
        email: nuevoUsuario.email,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        rol: nuevoUsuario.rol,
        telefono: nuevoUsuario.telefono,
        created_at: nuevoUsuario.created_at
      };
      
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        token,
        usuario: usuarioResponse
      });
      
    } catch (error) {
      console.error('Error en register:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Verificar token
   */
  static async verifyToken(req, res) {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token requerido'
        });
      }
      
      // Verificar token
      const decoded = verifyToken(token);
      
      // Buscar usuario
      const usuario = await UsuarioUnifiedModel.findById(decoded.id);
      
      if (!usuario || !usuario.activo) {
        return res.status(401).json({
          success: false,
          message: 'Token inválido o usuario inactivo'
        });
      }
      
      // Preparar respuesta
      const usuarioResponse = {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol,
        telefono: usuario.telefono,
        created_at: usuario.created_at
      };
      
      res.json({
        success: true,
        message: 'Token válido',
        usuario: usuarioResponse
      });
      
    } catch (error) {
      console.error('Error en verifyToken:', error);
      
      if (error.message === 'Token expirado') {
        return res.status(401).json({
          success: false,
          message: 'Token expirado'
        });
      }
      
      if (error.message === 'Token inválido') {
        return res.status(401).json({
          success: false,
          message: 'Token inválido'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  static async getProfile(req, res) {
    try {
      const usuario = await UsuarioUnifiedModel.findById(req.user.id);
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
      
      // Preparar respuesta (sin contraseña)
      const usuarioResponse = {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol,
        telefono: usuario.telefono,
        activo: usuario.activo,
        created_at: usuario.created_at,
        updated_at: usuario.updated_at
      };
      
      res.json({
        success: true,
        message: 'Perfil obtenido exitosamente',
        usuario: usuarioResponse
      });
      
    } catch (error) {
      console.error('Error en getProfile:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Actualizar perfil del usuario autenticado
   */
  static async updateProfile(req, res) {
    try {
      const { nombre, apellido, telefono } = req.body;
      const userId = req.user.id;
      
      const updateData = {};
      if (nombre) updateData.nombre = nombre;
      if (apellido) updateData.apellido = apellido;
      if (telefono) updateData.telefono = telefono;
      
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No hay datos para actualizar'
        });
      }
      
      const usuarioActualizado = await UsuarioUnifiedModel.update(userId, updateData);
      
      // Preparar respuesta (sin contraseña)
      const usuarioResponse = {
        id: usuarioActualizado.id,
        email: usuarioActualizado.email,
        nombre: usuarioActualizado.nombre,
        apellido: usuarioActualizado.apellido,
        rol: usuarioActualizado.rol,
        telefono: usuarioActualizado.telefono,
        activo: usuarioActualizado.activo,
        created_at: usuarioActualizado.created_at,
        updated_at: usuarioActualizado.updated_at
      };
      
      res.json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        usuario: usuarioResponse
      });
      
    } catch (error) {
      console.error('Error en updateProfile:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Cambiar contraseña
   */
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;
      
      // Obtener usuario actual
      const usuario = await UsuarioUnifiedModel.findById(userId);
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
      
      // Verificar contraseña actual
      const currentPasswordValid = await comparePassword(currentPassword, usuario.contraseña);
      
      if (!currentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña actual es incorrecta'
        });
      }
      
      // Validar nueva contraseña
      const passwordValidation = validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Nueva contraseña inválida',
          errors: passwordValidation.errors
        });
      }
      
      // Encriptar nueva contraseña
      const hashedNewPassword = await hashPassword(newPassword);
      
      // Actualizar contraseña
      await UsuarioUnifiedModel.update(userId, { password: hashedNewPassword });
      
      res.json({
        success: true,
        message: 'Contraseña actualizada exitosamente'
      });
      
    } catch (error) {
      console.error('Error en changePassword:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Cerrar sesión
   */
  static async logout(req, res) {
    try {
      // En un sistema JWT, el logout se maneja en el cliente
      // eliminando el token del localStorage
      res.json({
        success: true,
        message: 'Sesión cerrada exitosamente'
      });
      
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Probar conexión
   */
  static async testConnection(req, res) {
    try {
      res.json({
        success: true,
        message: 'Conexión exitosa',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
      });
      
    } catch (error) {
      console.error('Error en testConnection:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}