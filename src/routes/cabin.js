const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware.js");

const createCabin = require("../controllers/cabin/createCabin");
const getAllCabins = require("../controllers/cabin/getAllCabins");
const getCabin = require("../controllers/cabin/getCabin");
const updateCabin = require("../controllers/cabin/updateCabin");
const deleteCabin = require("../controllers/cabin/deleteCabin");

router.post("/:userId", verifyToken, createCabin);

router.get("/", getAllCabins);

router.get("/:cabinId", getCabin);

router.put("/:cabinId", verifyToken, updateCabin);

router.delete("/:cabinId", verifyToken, deleteCabin);

module.exports = router;
