const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://admin:admin123@actividad9.mrktgg6.mongodb.net/registro_usuarios';

const conectarDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conexión exitosa a MongoDB Atlas');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};

module.exports = conectarDB;