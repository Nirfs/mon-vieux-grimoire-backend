const express = require('express');
const router = express.Router();

const AuthCtrl = require('../controllers/auth');

router.post('/signup', AuthCtrl.signUp);
router.post('/login', AuthCtrl.login);

module.exports = router;