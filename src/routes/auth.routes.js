import express from 'express';
import { body } from 'express-validator';
// import { login, register, logout, verificarToken } from '../controllers/auth.controller.js';
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
  // login
  (req, res) => {
    res.json({ message: 'Ruta de login - Por implementar' });
  }
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
  // register
  (req, res) => {
    res.json({ message: 'Ruta de registro - Por implementar' });
  }
);

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión
 * @access  Private
 */
router.post('/logout',
  // logout
  (req, res) => {
    res.json({ message: 'Ruta de logout - Por implementar' });
  }
);

/**
 * @route   GET /api/auth/verify
 * @desc    Verificar token
 * @access  Private
 */
router.get('/verify',
  // verificarToken
  (req, res) => {
    res.json({ message: 'Ruta de verificación - Por implementar' });
  }
);

export default router;


