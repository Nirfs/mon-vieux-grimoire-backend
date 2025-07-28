const express = require("express")
const app = express();

const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');

app.use('/api/books', booksRoutes);
app.use('/api/auth', authRoutes);

module.exports = app