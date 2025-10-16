import express from 'express';
import { body } from 'express-validator';
import { login, register, logout, verificarTokenController } from '../controllers/auth.controller.js';
import { loginAdmin, verificarTokenAdmin } from '../controllers/auth-admin.controller.js';
import { manejarErroresValidacion } from '../middleware/validator.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
router.post('/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Contraseña requerida'),
    manejarErroresValidacion
  ],
  login
);

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post('/register',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres'),
    body('nombre').notEmpty().withMessage('Nombre requerido'),
    body('apellido').notEmpty().withMessage('Apellido requerido'),
    manejarErroresValidacion
  ],
  register
);

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión
 * @access  Private
 */
router.post('/logout', logout);

/**
 * @route   GET /api/auth/verify
 * @desc    Verificar token
 * @access  Private
 */
router.get('/verify', verificarTokenController);

/**
 * @route   POST /api/auth/login-admin
 * @desc    Iniciar sesión como administrador
 * @access  Public
 */
router.post('/login-admin',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Contraseña requerida'),
    manejarErroresValidacion
  ],
  loginAdmin
);

/**
 * @route   GET /api/auth/verify-admin
 * @desc    Verificar token de administrador
 * @access  Private
 */
router.get('/verify-admin', verificarTokenAdmin);

// Ruta de prueba de conexión
router.get('/test', async (req, res) => {
  try {
    const { verificarConexion } = await import('../config/database.js');
    const conexionOk = await verificarConexion();
    
    if (conexionOk) {
      res.json({
        message: '✅ Conexión a Supabase exitosa',
        timestamp: new Date().toISOString(),
        status: 'OK'
      });
    } else {
      res.status(500).json({
        message: '❌ Error de conexión a Supabase',
        timestamp: new Date().toISOString(),
        status: 'ERROR'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: '❌ Error al verificar conexión',
      error: error.message,
      timestamp: new Date().toISOString(),
      status: 'ERROR'
    });
  }
});

export default router;


