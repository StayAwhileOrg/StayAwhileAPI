const Booking = require("../../models/booking.model.js");
const User = require("../../models/user.model");

const getAllBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        const requestUser = User.findById(req.user);

        if (req.user !== userId || !requestUser) {
            return res.status(400).json({
                message: "You do not have access to these bookings",
            });
        }

        const bookings = await Booking.find({ user: userId })
            .populate("cabin")
            .populate("owner", "name email")
            .sort({ startDate: 1 });

        if (!bookings.length || !bookings) {
            return res
                .status(404)
                .json({ message: "No bookings found for this user" });
        }

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = getAllBookings;
