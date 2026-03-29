require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ origin: '*' })); // Open CORS for simplicity during deploy demonstration unless specifically tightened.
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/barbershop')
  .then(() => console.log('MongoDB connected successfully (Atlas / Local)'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
const corteRoutes = require('./routes/corteRoutes');
app.use('/api/cortes', corteRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (Modo: Producción MongoDB)`);
});
