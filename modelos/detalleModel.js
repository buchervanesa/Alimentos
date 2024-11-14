const mysql = require('mysql');
const configuracion = require('../config.json');

const connection = mysql.createConnection(configuracion.database);

// Métodos para manejar detalles de pedidos
const metodos = {};

// Crear un nuevo detalle de pedido
metodos.createDetallePedido = (datosDetalle, callback) => {
    const consulta = 'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)';
    const params = [datosDetalle.pedido_id, datosDetalle.producto_id, datosDetalle.cantidad, datosDetalle.precio];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            console.error('Error al crear detalle de pedido:', err.message);
            callback(err);
            return;
        }
        callback(null, result);
    });
};

// Obtener todos los detalles de pedidos
metodos.getAllDetalles = (callback) => {
    const consulta = 'SELECT * FROM detalle_pedidos';
    connection.query(consulta, (err, resultados) => {
        if (err) {
            console.error('Error en la consulta de detalles de pedidos:', err.message);
            callback(err);
            return;
        }
        callback(null, resultados);
    });
};

module.exports = { metodos };
