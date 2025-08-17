const Book = require('../models/Books');
const fs = require('fs');
const path = require('path');

// Obtenir tous les livres
exports.getAllBooks = (req, res) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

// Obtenir un livre par ID
exports.getBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) return res.status(404).json({ message: 'Livre non trouvé !' });
      res.status(200).json(book);
    })
    .catch(error => res.status(400).json({ error }));
};

// Obtenir les 3 livres les mieux notés
exports.getBestRating = (req, res) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

// Créer un livre
exports.createBook = (req, res) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._userId;

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

// Noter un livre
exports.rateBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) return res.status(404).json({ message: 'Livre non trouvé' });

      const { userId, rating } = req.body;

      const alreadyRated = book.ratings.some(rate => rate.userId === userId);
      if (alreadyRated) return res.status(403).json({ message: 'Déjà noté' });

      if (rating < 0 || rating > 5) return res.status(400).json({ message: 'Note invalide' });

      book.ratings.push({ userId, grade: rating });
      const total = book.ratings.reduce((sum, r) => sum + r.grade, 0);
      book.averageRating = total / book.ratings.length;

      book.save()
        .then(updatedBook => res.status(200).json(updatedBook))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
};

// Modifier un livre
exports.modifyBook = (req, res) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
    : { ...req.body };

  delete bookObject._userId;

  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId !== req.auth.userId) {
        return res.status(401).json({ message: 'Non autorisé' });
      }

      // Mémoriser l'ancienne image si on en met une nouvelle
      let oldImageFilename = null;
      if (req.file && book.imageUrl) {
        oldImageFilename = book.imageUrl.split('/images/')[1];
      }

      Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
        .then(() => {
                  // Si nouvelle images on supprime l'ancienne
                  if (oldImageFilename) {
                    fs.promises.unlink(path.join('images', oldImageFilename)).catch(() => {});
                  }
                  return res.status(200).json({ message: 'Modifié avec succès' });
                })
                .catch(error => res.status(401).json(error));
            })
            .catch(error => res.status(400).json({ error }));
};

// Supprimer un livre
exports.deleteBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
      if (book.userId !== req.auth.userId) {
        return res.status(401).json({ message: 'Non autorisé' });
      }

      const filename = book.imageUrl.split('/images/')[1];

      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
          .catch(error => res.status(401).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};