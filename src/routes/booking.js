const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware.js");

const createBooking = require("../controllers/booking/createBooking.js");
const getAllBooking = require("../controllers/booking/getAllBookings.js");
const getBooking = require("../controllers/booking/getBooking.js");
const updateBooking = require("../controllers/booking/updateBooking.js");

router.post("/:cabinId", verifyToken, createBooking);

router.get("/all/:userId", verifyToken, getAllBooking);

router.get("/:bookingId", verifyToken, getBooking);

router.put("/:bookingId", verifyToken, updateBooking);

module.exports = router;
