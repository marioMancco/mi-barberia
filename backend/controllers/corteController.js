const Corte = require('../models/Corte');

exports.registrarCorte = async (req, res) => {
  try {
    const { tipoServicio, rating, areaMejora } = req.body;
    
    let precio = 0;
    let gananciaBarbero = 0;
    let comisionJefe = 0;

    switch(tipoServicio) {
      case 'corte':
        precio = 15000;
        gananciaBarbero = 10000;
        comisionJefe = 5000;
        break;
      case 'cerquillos':
        precio = 5000;
        gananciaBarbero = 5000;
        comisionJefe = 0;
        break;
      case 'barba':
        precio = 5000;
        gananciaBarbero = 5000;
        comisionJefe = 0;
        break;
      case 'corte_barba':
        precio = 18000;
        gananciaBarbero = 13000;
        comisionJefe = 5000;
        break;
      default:
        precio = 15000;
        gananciaBarbero = 10000;
        comisionJefe = 5000;
        break;
    }

    const nuevoCorte = new Corte({
      tipoServicio: tipoServicio || 'corte',
      precio,
      gananciaBarbero,
      comisionJefe,
      rating: Number(rating),
      areaMejora: areaMejora || ''
    });

    await nuevoCorte.save();

    res.status(201).json({
      success: true,
      message: 'Corte registrado exitosamente en Base de Datos',
      data: nuevoCorte
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar el corte',
      error: error.message
    });
  }
};

exports.obtenerCortes = async (req, res) => {
  try {
    const cortes = await Corte.find().sort({ fecha: -1 });
    
    res.status(200).json({
      success: true,
      data: cortes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener cortes',
      error: error.message
    });
  }
};
