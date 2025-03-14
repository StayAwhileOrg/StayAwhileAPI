const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware.js");
// import functionality

router.post("/booking/:userId/:cabinId", verifyToken, createBooking);

router.get("/booking/user/:userId", verifyToken, getAllBookingsFromUser);

router.get("/booking/:bookingId", verifyToken, getSingleBooking);

router.put("/booking/:bookingId", verifyToken, updateBooking);

module.exports = router;
