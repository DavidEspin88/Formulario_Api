const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/db');

const app = express();
const PUERTO = 5001;
let urlApp = 'http://localhost:4200';

// Conectar a la base de datos
conectarDB();

// Middlewares
app.use(express.json());
app.use(cors({
    origin: urlApp,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rutas
app.use('/api/v1', require('./rutas/clientes'));

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: 'API de Clientes funcionando correctamente' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ mensaje: 'Algo salió mal!', error: err.message });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PUERTO, () => {
    console.log(`Servidor funcionando en http://localhost:${PUERTO}`);
    console.log(`Frontend permitido desde: ${urlApp}`);
});