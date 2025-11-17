const RutaBus = require('../models/RutaBus');
const { generarXMLDesdeJSON, generarXMLDirecto } = require('../services/xmlService');

// @desc    Obtener todas las rutas (solo activas)
// @route   GET /api/rutas
const obtenerRutas = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      sort = '-fechaSalida',
      ruta,
      conductor,
      fechaInicio,
      fechaFin
    } = req.query;

    // Construir query dinámica
    const query = { estado: 'activo' };
    if (ruta) query.ruta = { $regex: ruta, $options: 'i' };
    if (conductor) query.conductor = { $regex: conductor, $options: 'i' };
    if (fechaInicio || fechaFin) {
      query.fechaSalida = {};
      if (fechaInicio) query.fechaSalida.$gte = new Date(fechaInicio);
      if (fechaFin) query.fechaSalida.$lte = new Date(fechaFin);
    }

    const rutas = await RutaBus.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await RutaBus.countDocuments(query);

    res.status(200).json({
      success: true,
      count: rutas.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: rutas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener rutas',
      error: error.message
    });
  }
};

// @desc    Crear nueva ruta
// @route   POST /api/rutas
const crearRuta = async (req, res) => {
  try {
    const nuevaRuta = await RutaBus.create(req.body);
    res.status(201).json({
      success: true,
      data: nuevaRuta,
      message: 'Ruta creada exitosamente'
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al crear ruta',
      error: error.message
    });
  }
};

// @desc    Obtener ruta por ID
// @route   GET /api/rutas/:id
const obtenerRutaPorId = async (req, res) => {
  try {
    const ruta = await RutaBus.findById(req.params.id);
    if (!ruta || ruta.estado === 'inactivo') {
      return res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
      });
    }
    res.status(200).json({
      success: true,
      data: ruta
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener ruta',
      error: error.message
    });
  }
};

// @desc    Actualizar ruta
// @route   PUT /api/rutas/:id
const actualizarRuta = async (req, res) => {
  try {
    const rutaActualizada = await RutaBus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );
    if (!rutaActualizada) {
      return res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
      });
    }
    res.status(200).json({
      success: true,
      data: rutaActualizada,
      message: 'Ruta actualizada exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar ruta',
      error: error.message
    });
  }
};

// @desc    Eliminar ruta (borrado lógico)
// @route   DELETE /api/rutas/:id
const eliminarRuta = async (req, res) => {
  try {
    const rutaEliminada = await RutaBus.findByIdAndUpdate(
      req.params.id,
      { estado: 'inactivo' },
      { new: true }
    );
    if (!rutaEliminada) {
      return res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Ruta eliminada exitosamente (borrado lógico)'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar ruta',
      error: error.message
    });
  }
};

// @desc    Exportar XML - Método 1: JSON → XML
// @route   GET /api/rutas/export/xml
const exportarXMLMetodo1 = async (req, res) => {
  try {
    const rutas = await RutaBus.find({ estado: 'activo' }).sort({ fechaSalida: -1 });
    const xml = await generarXMLDesdeJSON(rutas);
    
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', 'attachment; filename="rutas_buses_metodo1.xml"');
    res.status(200).send(xml);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al generar XML (Método 1)',
      error: error.message
    });
  }
};

// @desc    Exportar XML - Método 2: XML Directo
// @route   GET /api/rutas/export/xml-directo
const exportarXMLMetodo2 = async (req, res) => {
  try {
    const rutas = await RutaBus.find({ estado: 'activo' }).sort({ fechaSalida: -1 });
    const xml = generarXMLDirecto(rutas);
    
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', 'attachment; filename="rutas_buses_metodo2.xml"');
    res.status(200).send(xml);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al generar XML (Método 2)',
      error: error.message
    });
  }
};

// @desc    Obtener estadísticas agregadas
// @route   GET /api/rutas/estadisticas
const obtenerEstadisticas = async (req, res) => {
  try {
    const estadisticas = await RutaBus.aggregate([
      { $match: { estado: 'activo' } },
      {
        $group: {
          _id: '$ruta',
          totalDinero: { $sum: '$cantidadDinero' },
          cantidadViajes: { $sum: 1 },
          promedioDinero: { $avg: '$cantidadDinero' }
        }
      },
      { $sort: { totalDinero: -1 } },
      {
        $project: {
          ruta: '$_id',
          totalDinero: 1,
          cantidadViajes: 1,
          promedioDinero: { $round: ['$promedioDinero', 2] },
          _id: 0
        }
      }
    ]);

    const totalGeneral = estadisticas.reduce((acc, item) => acc + item.totalDinero, 0);
    
    res.status(200).json({
      success: true,
      data: {
        porRuta: estadisticas,
        totalGeneral,
        totalRutas: estadisticas.length,
        fechaGeneracion: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

module.exports = {
  obtenerRutas,
  crearRuta,
  obtenerRutaPorId,
  actualizarRuta,
  eliminarRuta,
  exportarXMLMetodo1,
  exportarXMLMetodo2,
  obtenerEstadisticas
};