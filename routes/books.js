const express = require('express');
const router = express.Router();

const bookCtrl = require('../controllers/books');

const auth = require('../middlware/auth')
const { upload, imageOptimizer } = require('../middlware/multer-config');

router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestRating);  
router.get('/:id', bookCtrl.getBook);


router.post('/',auth,upload,imageOptimizer, bookCtrl.createBook);
router.post('/:id/rating',auth, bookCtrl.rateBook);

router.put('/:id',auth,upload,imageOptimizer, bookCtrl.modifyBook);
router.delete('/:id',auth, bookCtrl.deleteBook);

module.exports = router;