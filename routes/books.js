const express = require('express');
const router = express.Router();

const bookCtrl = require('../controllers/books');

router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestRating);  
router.get('/:id', bookCtrl.getBook);


router.post('/', bookCtrl.createBook);
router.post('/:id/rating', bookCtrl.rateBook);

router.put('/:id', bookCtrl.modifyBook);
router.delete('/:id', bookCtrl.deleteBook);

module.exports = router;