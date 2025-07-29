const Book = require('../models/books');
const fs = require('fs')

exports.getAllBooks = (req, res) => {
    Book.find()
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({error}))
};

exports.getBook = (req, res) => {

};

exports.getBestRating = (req, res) => {

};

exports.createBook = (req, res) => {

};

exports.rateBook = (req, res) => {

};

exports.modifyBook = (req, res) => {

};

exports.deleteBook = (req, res) => {

};