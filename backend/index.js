// backend/index.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

//remember???
// Configurar la conexión a PostgreSQL
const connectionString = "postgresql://postgres:Soriano03@localhost:5432/suministros_db?schema=public";

// Crear un pool de conexiones (recomendado para producción)
const pool = new Pool({ connectionString });

// Crear el adaptador de Prisma usando el pool
const adapter = new PrismaPg(pool);

// Inicializar PrismaClient con el adaptador
const prisma = new PrismaClient({ adapter });

const app = express();
const port = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba de conexión
app.get('/api/test', async (req, res) => {
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
    const { nombre, precio, stock, categoria, descripcion, imagenUrl } = req.body;
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
app.listen(port, () => {
  console.log(`\n🚀 Servidor backend corriendo en http://localhost:${port}`);
  console.log(`🔧 Prueba de adaptador: http://localhost:${port}/api/test`);
  console.log(`📦 Productos: http://localhost:${port}/api/productos\n`);
});