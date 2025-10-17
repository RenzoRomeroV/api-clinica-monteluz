import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  validateLogin,
  validateRegister,
  validateChangePassword,
  validateUpdateProfile,
  validateVerifyToken
} from '../validators/auth.validator.js';

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
router.post('/login', validateLogin, AuthController.login);

/**
 * @route   POST /api/auth/login-admin
 * @desc    Iniciar sesión como administrador
 * @access  Public
 */
router.post('/login-admin', validateLogin, AuthController.loginAdmin);

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post('/register', validateRegister, AuthController.register);

/**
 * @route   POST /api/auth/verify
 * @desc    Verificar token JWT
 * @access  Public
 */
router.post('/verify', validateVerifyToken, AuthController.verifyToken);

/**
 * @route   GET /api/auth/profile
 * @desc    Obtener perfil del usuario autenticado
 * @access  Private
 */
router.get('/profile', authenticate, AuthController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Actualizar perfil del usuario autenticado
 * @access  Private
 */
router.put('/profile', authenticate, validateUpdateProfile, AuthController.updateProfile);

/**
 * @route   POST /api/auth/change-password
 * @desc    Cambiar contraseña del usuario autenticado
 * @access  Private
 */
router.post('/change-password', authenticate, validateChangePassword, AuthController.changePassword);

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión
 * @access  Private
 */
router.post('/logout', authenticate, AuthController.logout);

/**
 * @route   GET /api/auth/test
 * @desc    Probar conexión con el servidor
 * @access  Public
 */
router.get('/test', AuthController.testConnection);

/**
 * @route   POST /api/auth/create-admin
 * @desc    Crear administrador inicial
 * @access  Public
 */
router.post('/create-admin', AuthController.createAdmin);

export default router;
