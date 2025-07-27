const express = require('express');
const rutas = express.Router();
const Cliente = require('../models/Cliente');

// GET - Obtener todos los clientes
rutas.get('/clientes', async (req, res) => {
    try {
        const clientes = await Cliente.find().sort({ createdAt: -1 });
        res.status(200).json(clientes);
    } catch (error) {
        console.log('Error al obtener los clientes:', error);  
        res.status(500).json({ mensaje: 'Error al obtener los clientes', error: error.message });
    }      
});

// GET ID - Obtener cliente por ID
rutas.get('/clientes/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        res.status(200).json(cliente);  
    } catch (error) {
        console.log('Error al obtener el cliente:', error);
        res.status(500).json({ mensaje: 'Error al obtener el cliente', error: error.message });
    }
});

// POST - Crear cliente
rutas.post('/clientes', async (req, res) => {
    try {
        const { cedula, nombres, apellidos, correo, telefono, ciudad } = req.body;
        
        // Verificar si ya existe un cliente con la misma cédula o correo
        const clienteExistente = await Cliente.findOne({
            $or: [{ cedula }, { correo }]
        });
        
        if (clienteExistente) {
            return res.status(400).json({ 
                mensaje: 'Ya existe un cliente con esa cédula o correo electrónico' 
            });
        }
        
        const nuevoCliente = new Cliente({
            cedula,
            nombres,
            apellidos,
            correo,
            telefono,
            ciudad
        });
        
        const clienteGuardado = await nuevoCliente.save();
        res.status(201).json({ 
            mensaje: "Cliente creado exitosamente", 
            cliente: clienteGuardado 
        });
    } catch (error) {
        console.log('Error al crear el cliente:', error);
        if (error.code === 11000) {
            // Error de duplicado
            res.status(400).json({ 
                mensaje: 'Ya existe un cliente con esa cédula o correo electrónico' 
            });
        } else {
            res.status(500).json({ 
                mensaje: 'Error al crear el cliente', 
                error: error.message 
            });
        }
    }
});

// PUT - Actualizar cliente
rutas.put('/clientes/:id', async (req, res) => {
    try {
        const { cedula, nombres, apellidos, correo, telefono, ciudad } = req.body;
        
        const clienteActualizado = await Cliente.findByIdAndUpdate(
            req.params.id,
            { cedula, nombres, apellidos, correo, telefono, ciudad },
            { new: true, runValidators: true }
        );
        
        if (!clienteActualizado) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        
        res.status(200).json({ 
            mensaje: 'Cliente actualizado correctamente', 
            cliente: clienteActualizado 
        });
    } catch (error) {    
        console.log('Error al actualizar el cliente:', error);
        if (error.code === 11000) {
            res.status(400).json({ 
                mensaje: 'Ya existe un cliente con esa cédula o correo electrónico' 
            });
        } else {
            res.status(500).json({ 
                mensaje: 'Error al actualizar el cliente', 
                error: error.message 
            });
        }
    }
});

// DELETE - Eliminar cliente
rutas.delete('/clientes/:id', async (req, res) => {
    try {
        const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);
        
        if (!clienteEliminado) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        
        res.status(200).json({ mensaje: 'Cliente eliminado correctamente' });
    } catch (error) {
        console.log('Error al eliminar el cliente:', error);
        res.status(500).json({ 
            mensaje: 'Error al eliminar el cliente', 
            error: error.message 
        });
    }
});

module.exports = rutas;