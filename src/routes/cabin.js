const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware.js");

// import functionality

router.post("/cabin/:userId", verifyToken, createCabin);

router.get("/cabin", fetchAllCabins);

router.get("/cabin/:cabinId", getSingleCabin);

router.put("/cabin/:cabinId", verifyToken, updateCabin);

router.delete("/cabin/:cabinId", verifyToken, deleteCabin);

module.exports = router;
