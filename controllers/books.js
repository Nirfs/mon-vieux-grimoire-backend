const Book = require('../models/Books');
const fs = require('fs')

exports.getAllBooks = (req, res) => {
    //Recuperer tout les livre de la base de donnée
    Book.find()
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({error}))
};

exports.getBook = (req, res) => {   
    //Recuperer un livre de la base de donnée -> _id définit par mongodb pour chaque item =  a l'id de l'url (req.params.id)
    Book.findOne({_id: req.params.id})
        .then(book => {
            if (!book){
                return res.status(404).json({ message: 'Livre non trouvé !' })
            }
            res.status(200).json(book)
        })
        .catch(error => res.status(400).json({error}))
};

exports.getBestRating = (req, res) => {
    //Recuperer tout les livre de la base de donnée, tri dans l'ordre décroissant, prend les 3 premier
    Book.find()
        .sort({averageRating: -1})
        .limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({error}))
};

exports.createBook = (req, res) => {

};

exports.rateBook = (req, res) => {

};

exports.modifyBook = (req, res) => {

};

exports.deleteBook = (req, res) => {

};