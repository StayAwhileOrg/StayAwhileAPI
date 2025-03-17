const express = require("express");
const router = express.Router();
const getProfile = require('../controllers/profile/getProfile.js');
const updateProfile = require('../controllers/profile/updateProfile.js');
const deleteProfile = require('../controllers/profile/deleteProfile.js');
const rateProfile = require('../controllers/profile/rateProfile.js');
const { verifyToken } = require("../middleware.js");

router.get('/profile/:userId', verifyToken, getProfile);

router.put('/profile/:userId', verifyToken, updateProfile);

router.post('/profile/rate/:userId', verifyToken, rateProfile);

router.delete("/profile/:userId", verifyToken, deleteProfile);

module.exports = router;
