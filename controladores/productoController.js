const express = require('express');
const router = express.Router();
const productoBD = require('../modelos/ProductosModel');

// Crear un producto
router.post('/create', (req, res) => {
    productoBD.metodos.createProducto(req.body, (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(201).json({ message: 'Producto creado con éxito', result });
        }
    });
});

// Listar productos
router.get('/list', (req, res) => {
    productoBD.metodos.getAllProductos((err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(result);
        }
    });
});

module.exports = router;
