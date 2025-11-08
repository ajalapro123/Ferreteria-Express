require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas estáticas
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Importar conexión BD (pool de mysql2/promise)
const { pool } = require('./config/database');

// Rutas de la API
const productosRoutes = require('./routes/productos');
const clientesRoutes = require('./routes/clientes');
const proveedoresRoutes = require('./routes/proveedores');
const usuariosRoutes = require('./routes/usuarios');
const ventasRoutes = require('./routes/ventas');
const soporteRoutes = require('./routes/soporte');

// Ruta de prueba para ver si la API responde
app.get('/', (req, res) => {
    res.send("✅ API funcionando");
});

// Ruta health/db para verificar conexión real
app.get('/health/db', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1");
        return res.json({ db: true, rows });
    } catch (err) {
        return res.json({ db: false, error: err.message });
    }
});

// ✅ PRUEBA INICIAL DE CONEXIÓN (aquí veremos el error real)
(async () => {
    console.log("🔍 Probando conexión inicial a la BD...");
    try {
        const [rows] = await pool.query("SELECT 1");
        console.log("✅ Conexión inicial OK:", rows);
    } catch (err) {
        console.error("❌ Error inicial de BD:", err);
    }
})();

// Montar endpoints
app.use('/productos', productosRoutes);
app.use('/clientes', clientesRoutes);
app.use('/proveedores', proveedoresRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/ventas', ventasRoutes);
app.use('/soporte', soporteRoutes);

// 404 para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`✅ API en puerto ${PORT}`);
});
