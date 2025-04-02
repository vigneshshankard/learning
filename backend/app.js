const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Middleware, routes, etc.
module.exports = app;