import express from 'express';
import { body } from 'express-validator';
// import { obtenerCitas, crearCita, obtenerCitaPorId, actualizarCita, eliminarCita } from '../controllers/citas.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';
import { manejarErroresValidacion } from '../middleware/validator.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

/**
 * @route   GET /api/citas
 * @desc    Obtener todas las citas
 * @access  Private
 */
router.get('/',
  // obtenerCitas
  (req, res) => {
    res.json({ message: 'Listar citas - Por implementar' });
  }
);

/**
 * @route   POST /api/citas
 * @desc    Crear nueva cita
 * @access  Private
 */
router.post('/',
  [
    body('paciente_id').notEmpty().withMessage('ID de paciente requerido'),
    body('doctor_id').notEmpty().withMessage('ID de doctor requerido'),
    body('fecha').isISO8601().withMessage('Fecha inválida'),
    body('hora').notEmpty().withMessage('Hora requerida'),
    body('servicio_id').notEmpty().withMessage('ID de servicio requerido'),
    manejarErroresValidacion
  ],
  // crearCita
  (req, res) => {
    res.json({ message: 'Crear cita - Por implementar' });
  }
);

/**
 * @route   GET /api/citas/:id
 * @desc    Obtener cita por ID
 * @access  Private
 */
router.get('/:id',
  // obtenerCitaPorId
  (req, res) => {
    res.json({ message: `Obtener cita ${req.params.id} - Por implementar` });
  }
);

/**
 * @route   PUT /api/citas/:id
 * @desc    Actualizar cita
 * @access  Private
 */
router.put('/:id',
  // actualizarCita
  (req, res) => {
    res.json({ message: `Actualizar cita ${req.params.id} - Por implementar` });
  }
);

/**
 * @route   DELETE /api/citas/:id
 * @desc    Eliminar cita
 * @access  Private
 */
router.delete('/:id',
  // eliminarCita
  (req, res) => {
    res.json({ message: `Eliminar cita ${req.params.id} - Por implementar` });
  }
);

export default router;




