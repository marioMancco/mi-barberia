const express = require('express');
const router = express.Router();
const corteController = require('../controllers/corteController');

router.post('/', corteController.registrarCorte);
router.get('/', corteController.obtenerCortes);

module.exports = router;
