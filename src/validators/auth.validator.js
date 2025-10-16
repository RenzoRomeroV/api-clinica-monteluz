import { body, validationResult } from 'express-validator';

/**
 * Middleware para manejar errores de validación
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

/**
 * Validaciones para login
 */
export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail()
    .trim(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .trim(),
  
  handleValidationErrors
];

/**
 * Validaciones para registro
 */
export const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail()
    .trim(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'),
  
  body('nombre')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios')
    .trim(),
  
  body('apellido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios')
    .trim(),
  
  body('telefono')
    .optional()
    .isMobilePhone('es-PE')
    .withMessage('El teléfono debe ser válido')
    .trim(),
  
  body('rol')
    .isIn(['paciente', 'doctor', 'admin', 'recepcionista'])
    .withMessage('El rol debe ser: paciente, doctor, admin o recepcionista'),
  
  handleValidationErrors
];

/**
 * Validaciones para cambio de contraseña
 */
export const validateChangePassword = [
  body('currentPassword')
    .isLength({ min: 6 })
    .withMessage('La contraseña actual debe tener al menos 6 caracteres')
    .trim(),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La nueva contraseña debe contener al menos una letra minúscula, una mayúscula y un número'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    }),
  
  handleValidationErrors
];

/**
 * Validaciones para actualizar perfil
 */
export const validateUpdateProfile = [
  body('nombre')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios')
    .trim(),
  
  body('apellido')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios')
    .trim(),
  
  body('telefono')
    .optional()
    .isMobilePhone('es-PE')
    .withMessage('El teléfono debe ser válido')
    .trim(),
  
  handleValidationErrors
];

/**
 * Validaciones para verificar token
 */
export const validateVerifyToken = [
  body('token')
    .notEmpty()
    .withMessage('El token es requerido')
    .trim(),
  
  handleValidationErrors
];

/**
 * Validaciones para solicitar restablecimiento de contraseña
 */
export const validateForgotPassword = [
  body('email')
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail()
    .trim(),
  
  handleValidationErrors
];

/**
 * Validaciones para restablecer contraseña
 */
export const validateResetPassword = [
  body('token')
    .notEmpty()
    .withMessage('El token es requerido')
    .trim(),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La nueva contraseña debe contener al menos una letra minúscula, una mayúscula y un número'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    }),
  
  handleValidationErrors
];
