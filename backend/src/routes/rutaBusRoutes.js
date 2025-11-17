const express = require('express');
const router = express.Router();
const controller = require('../controllers/rutaBusController');

// Rutas CRUD principales
router.route('/')
  .get(controller.obtenerRutas)
  .post(controller.crearRuta);

router.route('/:id')
  .get(controller.obtenerRutaPorId)
  .put(controller.actualizarRuta)
  .delete(controller.eliminarRuta);

// Rutas de exportación XML
router.get('/export/xml', controller.exportarXMLMetodo1);
router.get('/export/xml-directo', controller.exportarXMLMetodo2);

// Ruta de análisis
router.get('/estadisticas', controller.obtenerEstadisticas);

module.exports = router;
