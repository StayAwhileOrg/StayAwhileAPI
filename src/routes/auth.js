const express = require("express");
const router = express.Router();
// import functionality

router.post("/login", login);

router.post("/register", register);

module.exports = router;
