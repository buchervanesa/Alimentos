const express = require('express');
const router = express.Router();
const pacienteModel = require('../modelos/pacienteModel');


router.get('/', (req, res) => {
  pacienteModel.getAll((err, pacientes) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(pacientes);
    }
  });
});
router.get('/:id', (req, res) => {
    const id = req.params.id;
    pacienteModel.getById(id, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
});

router.get('/nss/:nss', (req, res) => {
  const nss = req.params.nss;

  pacienteModel.getByNSS(nss, (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Error al obtener el paciente por NSS' });
    }
    if (result.length === 0) {
      return res.status(404).send({ error: 'Paciente no encontrado' });
    }
    res.json(result);
  });
});



module.exports = router;
