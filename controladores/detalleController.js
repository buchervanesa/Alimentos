const express = require('express');
const router = express.Router();
const detallePedidoBD = require('../modelos/detalleModel');

// Crear un detalle de pedido
router.post('/create', (req, res) => {
    detallePedidoBD.metodos.createDetallePedido(req.body, (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(201).json({ message: 'Detalle de pedido creado con éxito', result });
        }
    });
});

// Listar detalles de pedidos
router.get('/list', (req, res) => {
    detallePedidoBD.metodos.getAllDetalles((err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(result);
        }
    });
});

module.exports = router;
