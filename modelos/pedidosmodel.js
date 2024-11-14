const mysql = require('mysql');
const configuracion = require('../config.json');

const connection = mysql.createConnection(configuracion.database);

const metodos = {};

// Método para crear un pedido// Método para crear un pedido
metodos.createPedido = function (datosPedido, callback) {
    const consulta = 'INSERT INTO pedidos (usuario_id, hijo_id, total) VALUES (?, ?, ?)';
    const params = [datosPedido.usuario_id, datosPedido.hijo_id, datosPedido.total];

    connection.query(consulta, params, function (err, result) {
        if (err) {
            console.error('Error al crear pedido:', err.message);
            callback(err);
            return;
        }

        const nuevoPedidoId = result.insertId; // Obtén el ID del nuevo pedido

        // Inserta los productos en la tabla pedido_productos
        if (datosPedido.productos && datosPedido.productos.length > 0) {
            const insertPromises = datosPedido.productos.map(producto => {
                return new Promise((resolve, reject) => {
                    // Obtén el ID del producto desde la base de datos
                    const consultaProducto = 'SELECT id FROM productos WHERE nombre = ?';
                    connection.query(consultaProducto, [producto.producto], (err, resultados) => {
                        if (err) {
                            console.error('Error al obtener ID del producto:', err.message);
                            return reject(err);
                        }

                        if (resultados.length === 0) {
                            return reject(new Error(`Producto '${producto.producto}' no encontrado.`));
                        }

                        const producto_id = resultados[0].id;

                        // Inserta en la tabla pedido_productos
                        const consultaInsert = 'INSERT INTO pedido_productos (pedido_id, producto_id, cantidad) VALUES (?, ?, ?)';
                        connection.query(consultaInsert, [nuevoPedidoId, producto_id, producto.cantidad], (err) => {
                            if (err) {
                                console.error('Error al insertar en pedido_productos:', err.message);
                                return reject(err);
                            }
                            resolve();
                        });
                    });
                });
            });

            // Espera a que todas las inserciones de productos se completen
            Promise.all(insertPromises)
                .then(() => callback(null, { mensaje: 'Pedido y productos creados con éxito', pedidoId: nuevoPedidoId }))
                .catch(err => {
                    console.error('Error al crear productos:', err.message);
                    callback(err);
                });
        } else {
            // Si no hay productos, solo devuelve el pedido creado
            callback(null, { mensaje: 'Pedido creado con éxito', pedidoId: nuevoPedidoId });
        }
    });
};

metodos.getAllPedidos = function (callback) {
    const consulta = ` 
        SELECT 
            p.id AS pedido_id, 
            u.nombre AS usuario, 
            h.nombre AS hijo, 
            pr.nombre AS producto, 
            pp.cantidad, 
            p.total
        FROM 
            pedidos p
        LEFT JOIN 
            usuarios u ON p.usuario_id = u.id
        LEFT JOIN 
            hijos h ON p.hijo_id = h.id
        LEFT JOIN 
            pedido_productos pp ON p.id = pp.pedido_id
        LEFT JOIN 
            productos pr ON pp.producto_id = pr.id;
    `;

    console.log('Consulta ejecutada:', consulta); // Log para verificar la consulta

    connection.query(consulta, function (err, resultados) {
        if (err) {
            console.error('Error en la consulta de pedidos:', err.message);
            callback(err);
            return;
        }
        console.log('Resultados de la consulta:', resultados); // Log para ver los resultados
        callback(null, resultados);
    });
};


module.exports = { metodos };
