const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 VERIFICANDO MONGODB_URI:', process.env.MONGODB_URI ? '✅ DEFINIDA' : '❌ INDEFINIDA');

// 🔥 IMPORTACIÓN QUE TE FALTABA
const rutaBusRoutes = require('./routes/rutaBusRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS para despliegue
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB Atlas con manejo de errores
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('✅ Conectado exitosamente a MongoDB Atlas'))
.catch(err => {
  console.error('❌ Error de conexión a MongoDB:', err.message);
  process.exit(1);
});

// Rutas principales
app.use('/api/rutas', rutaBusRoutes);

// Health check para despliegue
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
});
