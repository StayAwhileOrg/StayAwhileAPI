const Booking = require("../../models/booking.model.js");

const getBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        if (!bookingId) {
            return res.status(404).json({ message: "invalid booking id" });
        }
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const booking = await Booking.findById(bookingId)
            .populate("user", "name email")
            .populate("cabin")
            .populate("owner", "name email");

        const isGuest = booking.guest._id.toString() === req.user.toString();
        const isOwner = booking.owner._id.toString() === req.user.toString();
        if (!isGuest && !isOwner) {
            return res.status(403).json({
                message:
                    'You can only view your own bookings or bookings for cabins you own',
            });
        }

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = getBooking;
