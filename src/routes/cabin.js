const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware.js");

router.post("/cabin/:userId", verifyToken, require('../controllers/cabin/createCabin.js'));

router.get('/cabin', require('../controllers/cabin/getAllCabins.js'));

router.get('/cabin/:cabinId', require('../controllers/cabin/getCabin.js'));

router.put('/cabin/:cabinId', verifyToken, require('../controllers/cabin/updateCabin.js'));

router.delete('/cabin/:cabinId', verifyToken, require('../controllers/cabin/deleteCabin.js'));

module.exports = router;
