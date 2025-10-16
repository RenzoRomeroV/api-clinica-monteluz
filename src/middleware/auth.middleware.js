import { verifyToken, extractTokenFromHeader } from '../utils/jwt.js';
import { UsuarioUnifiedModel } from '../models/usuario-unified.model.js';

/**
 * Middleware de autenticación
 * Verifica el token JWT y carga el usuario en req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido'
      });
    }
    
    // Verificar token
    const decoded = verifyToken(token);
    
    // Buscar usuario en la base de datos
    const usuario = await UsuarioUnifiedModel.findById(decoded.id);
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    if (!usuario.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }
    
    // Agregar usuario a la request
    req.user = {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
      activo: usuario.activo
    };
    
    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    
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
    
    return res.status(500).json({
      success: false,
      message: 'Error de autenticación'
    });
  }
};

/**
 * Middleware para verificar roles específicos
 * @param {Array} roles - Array de roles permitidos
 */
export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    
    if (roles.length > 0 && !roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso'
      });
    }
    
    next();
  };
};

/**
 * Middleware para verificar si el usuario es administrador
 */
export const requireAdmin = authorize(['admin']);

/**
 * Middleware para verificar si el usuario es doctor o admin
 */
export const requireDoctorOrAdmin = authorize(['doctor', 'admin']);

/**
 * Middleware para verificar si el usuario es paciente o admin
 */
export const requirePacienteOrAdmin = authorize(['paciente', 'admin']);

/**
 * Middleware para verificar si el usuario puede acceder a su propio recurso
 * @param {string} paramName - Nombre del parámetro que contiene el ID del usuario
 */
export const requireOwnershipOrAdmin = (paramName = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    
    const resourceId = req.params[paramName];
    
    // Los administradores pueden acceder a cualquier recurso
    if (req.user.rol === 'admin') {
      return next();
    }
    
    // Los usuarios solo pueden acceder a sus propios recursos
    if (req.user.id !== resourceId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso'
      });
    }
    
    next();
  };
};

/**
 * Middleware opcional de autenticación
 * No falla si no hay token, pero carga el usuario si existe
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return next();
    }
    
    const decoded = verifyToken(token);
    const usuario = await UsuarioUnifiedModel.findById(decoded.id);
    
    if (usuario && usuario.activo) {
      req.user = {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol,
        activo: usuario.activo
      };
    }
    
    next();
  } catch (error) {
    // En caso de error, continuar sin usuario autenticado
    console.warn('Error en autenticación opcional:', error.message);
    next();
  }
};