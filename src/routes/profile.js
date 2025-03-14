const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware.js");
// import functionality

router.get("/profile", getAllProfiles);

router.get("/profile/:userId", singleProfile);

router.put("/profile/:userId", verifyToken, updateProfile);

router.delete("/profile/:userId", verifyToken, deleteProfile);

module.exports = router;
