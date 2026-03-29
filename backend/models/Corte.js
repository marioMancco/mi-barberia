const mongoose = require('mongoose');

const corteSchema = new mongoose.Schema({
  tipoServicio: {
    type: String,
    enum: ['corte', 'cerquillos', 'barba', 'corte_barba'],
    default: 'corte'
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  precio: {
    type: Number,
  },
  gananciaBarbero: {
    type: Number,
  },
  comisionJefe: {
    type: Number,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  areaMejora: {
    type: String,
    trim: true,
  }
});

module.exports = mongoose.model('Corte', corteSchema);
