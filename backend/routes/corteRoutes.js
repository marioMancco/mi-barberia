const express = require('express');
const router = express.Router();
const corteController = require('../controllers/corteController');

router.post('/', corteController.registrarCorte);
router.get('/', corteController.obtenerCortes);
router.put('/pagar', corteController.pagarDeuda);

module.exports = router;
