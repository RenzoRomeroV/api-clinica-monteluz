import { validationResult } from 'express-validator';

/**
 * Middleware para manejar errores de validación
 */
export const manejarErroresValidacion = (req, res, next) => {
  const errores = validationResult(req);
  
  if (!errores.isEmpty()) {
    return res.status(400).json({
      error: 'Errores de validación',
      detalles: errores.array().map(err => ({
        campo: err.path,
        mensaje: err.msg
      }))
    });
  }
  
  next();
};

export default manejarErroresValidacion;


