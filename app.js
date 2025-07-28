const express = require("express")
const app = express();
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');

const MONGO_URI = process.env.MONGODB_URI;
mongoose.connect(MONGO_URI,
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('/api/books', booksRoutes);
app.use('/api/auth', authRoutes);

module.exports = app