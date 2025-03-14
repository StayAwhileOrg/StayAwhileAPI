const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware.js");

router.post("/booking/:userId/:cabinId", verifyToken, require('../controllers/booking/createBooking.js'));

router.get("/booking/user/:userId", verifyToken, require('../controllers/booking/getAllBookings.js'));

router.get("/booking/:bookingId", verifyToken, require('../controllers/booking/getBooking.js'));

router.put("/booking/:bookingId", verifyToken, require('../controllers/booking/updateBooking.js'));

module.exports = router;
