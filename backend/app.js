const express = require('express');
const cors = require('cors');
const authRoutes = require('./authRoutes');
const sweetsRoutes = require('./sweetsRoutes');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/sweets', sweetsRoutes);

app.use('/api/auth', authRoutes);

module.exports = app;


