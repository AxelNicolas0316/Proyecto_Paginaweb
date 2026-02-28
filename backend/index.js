// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');


// Configurar la conexión a PostgreSQL desde variables de entorno
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public`;

// Crear un pool de conexiones (recomendado para producción)
const pool = new Pool({ connectionString });

// Crear el adaptador de Prisma usando el pool
const adapter = new PrismaPg(pool);

// Inicializar PrismaClient con el adaptador
const prisma = new PrismaClient({ adapter });

const app = express();
const port = process.env.NODE_PORT || 3001;

// Middlewares de manejo de errores (archivo separado)
const { notFound, errorHandler } = require('./middlewares/errorHandler');

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba de conexión
app.get('/api/tes', async (req, res) => {
  try {
    // Usar una consulta raw para probar la conexión
    const result = await prisma.$queryRaw`SELECT 1 as conexion`;
    res.json({ 
      success: true, 
      mensaje: '✅ Conexión a PostgreSQL exitosa usando adaptador',
      data: result
    });
  } catch (error) {
    console.error('Error de conexión:', error);
    res.status(500).json({ 
      success: false, 
      mensaje: '❌ Error de conexión',
      error: error.message 
    });
  }
});

// Ruta para obtener productos
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await prisma.producto.findMany();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para crear un producto de prueba
app.post('/api/productos', async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, error: 'Bad Request', message: 'Request body is required' });
    }

    const { nombre, precio, stock, categoria, descripcion, imagenUrl } = req.body || {};

    // Validar campos obligatorios
    const missing = [];
    if (!nombre) missing.push('nombre');
    if (precio === undefined || precio === null) missing.push('precio');
    if (stock === undefined || stock === null) missing.push('stock');

    if (missing.length) {
      return res.status(400).json({ success: false, error: 'Bad Request', message: `Missing fields: ${missing.join(', ')}` });
    }

    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre,
        precio: parseFloat(precio),
        stock: parseInt(stock),
        categoria,
        descripcion,
        imagenUrl: imagenUrl || 'https://via.placeholder.com/300',
      },
    });

    res.json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor
// Middleware para 405 Method Not Allowed (ruta existe pero método no)
app.use(require('./middlewares/methodNotAllowed')(app));

// Registrar middlewares de manejo de errores (404 y handler general)
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`\n🚀 Servidor backend corriendo en http://localhost:${port}`);
  console.log(`🔧 Prueba de adaptador: http://localhost:${port}/api/test`);
  console.log(`📦 Productos: http://localhost:${port}/api/productos\n`);
});