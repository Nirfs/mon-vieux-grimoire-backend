const express = require("express")
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')

const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');

const MONGO_URL ="mongodb+srv://KevP:nLbLDsGf1NXQ81FL@cluster0.3peluto.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URL || process.env.MONGO_URL,
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(cors())
app.use(express.json())
app.use('/images', express.static('images'))

app.use('/api/books', booksRoutes);
app.use('/api/auth', authRoutes);

module.exports = app