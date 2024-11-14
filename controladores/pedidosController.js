const express = require('express');
const router = express.Router();
const pedidosBD = require('../modelos/pedidosmodel'); // Asegúrate de que la ruta sea correcta

// Crear un nuevo pedido
router.post('/create', (req, res) => {
    pedidosBD.metodos.createPedido(req.body, (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(201).json({ message: 'Pedido creado con éxito', result });
        }
    });
});

// Listar todos los pedidos
router.get('/list', (req, res) => {
    pedidosBD.metodos.getAllPedidos((err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta de pedidos.' });
        }
        console.log('Cantidad de pedidos obtenidos:', resultados.length); // Log de la cantidad de resultados
        res.json(resultados);
    });
});


module.exports = router;
