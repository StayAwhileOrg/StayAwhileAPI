const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware.js");

const { createCabin } = require("../controllers/cabin/createCabin.js");
const { getAllCabins } = require("../controllers/cabin/getAllCabins.js");
const { getCabin } = require("../controllers/cabin/getCabin.js");
const { updateCabin } = require("../controllers/cabin/updateCabin.js");
const { deleteCabin } = require("../controllers/cabin/deleteCabin.js");

router.post("/:userId", verifyToken, createCabin);

router.get("/", getAllCabins);

router.get("/:cabinId", getCabin);

router.put("/:cabinId", verifyToken, updateCabin);

router.delete("/:cabinId", verifyToken, deleteCabin);

module.exports = router;
