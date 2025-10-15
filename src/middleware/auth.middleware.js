import jwt from 'jsonwebtoken';

/**
 * Middleware para verificar el token JWT
 */
export const verificarToken = (req, res, next) => {
  try {
    // Obtener token del header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: 'Token no proporcionado',
        message: 'Se requiere autenticación'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido',
      message: 'El token proporcionado no es válido o ha expirado'
    });
  }
};

/**
 * Middleware para verificar roles
 */
export const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        error: 'No autenticado',
        message: 'Debe estar autenticado para acceder a este recurso'
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'No tiene permisos para acceder a este recurso'
      });
    }

    next();
  };
};

export default { verificarToken, verificarRol };


