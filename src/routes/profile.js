const express = require("express");
const router = express.Router();
const getProfile = require('../controllers/profile/getProfile.js');
const updateProfile = require('../controllers/profile/updateProfile.js');
const { verifyToken } = require("../middleware.js");

// router.get("/profile", require('../controllers/profile/getAllProfiles.js'));

router.get('/profile/:userId', verifyToken, getProfile);

router.put('/profile/:userId', verifyToken, updateProfile);

// router.delete("/profile/:userId", verifyToken, require('../controllers/profile/deleteProfile.js'));

module.exports = router;
