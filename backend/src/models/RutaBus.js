const mongoose = require('mongoose');

const rutaBusSchema = new mongoose.Schema({
  fechaSalida: {
    type: Date,
    required: [true, 'La fecha de salida es obligatoria'],
    default: Date.now,
    index: true
  },
  ruta: {
    type: String,
    required: [true, 'El nombre de la ruta es obligatorio'],
    trim: true,
    maxlength: [100, 'La ruta no puede exceder 100 caracteres'],
    index: true
  },
  conductor: {
    type: String,
    required: [true, 'El nombre del conductor es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  cantidadDinero: {
    type: Number,
    required: [true, 'La cantidad de dinero es obligatoria'],
    min: [0, 'La cantidad debe ser positiva']
  },
  observaciones: {
    type: String,
    trim: true,
    maxlength: [500, 'Las observaciones no pueden exceder 500 caracteres']
  },
  estado: {
    type: String,
    enum: {
      values: ['activo', 'inactivo'],
      message: 'El estado debe ser activo o inactivo'
    },
    default: 'activo'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices compuestos para consultas avanzadas
rutaBusSchema.index({ fechaSalida: -1, ruta: 1 });

// Middleware pre-save para sanitización
rutaBusSchema.pre('save', function(next) {
  if (this.isModified('conductor')) {
    this.conductor = this.conductor.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }
  next();
});

module.exports = mongoose.model('RutaBus', rutaBusSchema);