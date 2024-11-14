// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const configuracion = require('../config.json');
// const router = express.Router();
// const usuarioBD = require('../modelos/usuariosModel');

// // Crear un usuario
// router.post('/create', (req, res) => {
//     const { nombre, email, password } = req.body;
//     // Encriptar la contraseña antes de guardarla
//     bcrypt.hash(password, 10, (err, hash) => {
//         if (err) {
//             return res.status(500).json({ error: 'Error en la encriptación de la contraseña' });
//         }
//         const datosUsuario = { nombre, email, password: hash };
//         usuarioBD.metodos.createUsuario(datosUsuario, (err, result) => {
//             if (err) {
//                 res.status(500).json(err);
//             } else {
//                 res.status(201).json({ message: 'Usuario creado con éxito', result });
//             }
//         });
//     });
// });

// // Login de usuario
// router.post('/login', (req, res) => {
//     const { email, password } = req.body;
//     usuarioBD.metodos.getUsuarioByEmail(email, (err, usuario) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error en la consulta del usuario' });
//         }
//         if (!usuario) {
//             return res.status(401).json({ message: 'Email no registrado' });
//         }
//         // Verificar la contraseña
//         bcrypt.compare(password, usuario.password, (err, esCorrecta) => {
//             if (err) {
//                 return res.status(500).json({ message: 'Error al comparar contraseñas' });
//             }
//             if (!esCorrecta) {
//                 return res.status(401).json({ message: 'Contraseña incorrecta' });
//             }
//             // Generar el token JWT
//             const token = jwt.sign({ id: usuario.id, email: usuario.email }, configuracion.jwtSecret, {
//                 expiresIn: '1h',
//             });
//             res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } });
//         });
//     });
// });

// // Listar usuarios
// router.get('/list', (req, res) => {
//     usuarioBD.metodos.getAllUsuarios((err, result) => {
//         if (err) {
//             res.status(500).json(err);
//         } else {
//             res.json(result);
//         }
//     });
// });

// module.exports = router;
require('dotenv').config(); // Cargar variables de entorno al inicio del archivo

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const usuarioBD = require('../modelos/usuariosModel');  // Importa el modelo que ahora tiene la conexión
const { connection } = usuarioBD;  // Extrae la conexión a la base de datos

// Crear un usuario
router.post('/create', (req, res) => {
    const { nombre, email, password } = req.body;
    // Encriptar la contraseña antes de guardarla
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la encriptación de la contraseña' });
        }
        const datosUsuario = { nombre, email, password: hash };
        usuarioBD.metodos.createUsuario(datosUsuario, (err, result) => {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(201).json({ message: 'Usuario creado con éxito', result });
            }
        });
    });
});

// Login de usuario
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    usuarioBD.metodos.getUsuarioByEmail(email, (err, usuario) => {
        if (err) {
            return res.status(500).json({ message: 'Error en la consulta del usuario' });
        }
        if (!usuario) {
            return res.status(401).json({ message: 'Email no registrado' });
        }
        // Verificar la contraseña
        bcrypt.compare(password, usuario.password, (err, esCorrecta) => {
            if (err) {
                return res.status(500).json({ message: 'Error al comparar contraseñas' });
            }
            if (!esCorrecta) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }
            // Generar el token JWT usando la clave secreta desde el .env
            const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });
            res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email,rol: usuario.rol,  } });
        });
    });
});

// Listar usuarios
router.get('/list', (req, res) => {
    usuarioBD.metodos.getAllUsuarios((err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(result);
        }
    });
});

// Actualizar saldo de usuario
router.put('/actualizar-saldo/:id', (req, res) => {
    const { id } = req.params;
    const { saldo } = req.body;

    // Consulta SQL para actualizar el saldo del usuario
    const consulta = 'UPDATE usuarios SET saldo = ? WHERE id = ?';

    connection.query(consulta, [saldo, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el saldo:', err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Saldo actualizado correctamente', saldo });
    });
});
router.delete('/eliminar-usuario/:id', (req, res) => {
    const { id } = req.params;

    // Consulta SQL para eliminar el usuario
    const consulta = 'DELETE FROM usuarios WHERE id = ?';

    connection.query(consulta, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el usuario:', err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    });
});

router.post('/hijos/create', async (req, res) => {
    const { nombre, edad, usuario_id } = req.body;

    // Asegúrate de que los campos necesarios están definidos


    // Asegúrate de que los campos necesarios están definidos
    if (!nombre || !edad || !usuario_id) {
        return res.status(400).json({ error: 'Faltan datos necesarios.' });
    }

    const hijoData = { nombre, edad, usuario_id };

    // Llama al método createHijo del modelo
    usuarioBD.metodos.createHijo(hijoData, (err, result) => {
        if (err) {
            console.error('Error al agregar el hijo:', err); // Registro del error en consola
            return res.status(500).json({ error: 'Error al agregar el hijo' });
        }
        
        res.status(201).json({ message: 'Hijo creado con éxito', id: result.insertId, nombre, edad, usuario_id });
    });
});
router.get('/hijos/list/:usuario_id', (req, res) => {
    const { usuario_id } = req.params;

    // Llamamos al método getHijos del modelo
    usuarioBD.metodos.getHijos(usuario_id, (err, hijos) => {
        if (err) {
            console.error('Error al obtener los hijos:', err);
            return res.status(500).json({ error: 'Error al obtener los hijos' });
        }
        
        res.status(200).json(hijos);
    });
});
module.exports = router;
