const express = require("express");
const router = express.Router();

router.post("/login", require('../controllers/auth/login.js'));

router.post('/register', require('../controllers/auth/register.js'));

module.exports = router;
