const express = require('express');
const router = express.Router();
const login = require('../controllers/auth/login.js');
const register = require('../controllers/auth/register.js');

router.post('/login', login);

router.post('/register', register);

module.exports = router;
