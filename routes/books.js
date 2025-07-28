const express = require('express');
const router = express.Router();

const BookCtrl = require('../controllers/books');

router.get('/', BookCtrl.getAllBooks);
router.get('/:id', BookCtrl.getBook);
router.get('/bestrating', BookCtrl.getBestRating);

router.post('/', BookCtrl.createBook);
router.post('/:id/rating', BookCtrl.rateBook);

router.put('/:id', BookCtrl.modifyBook);
router.delete('/:id', BookCtrl.deleteBook);

module.exports = router;