const Booking = require("../../models/booking.model");

const updateBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        ).populate({
            path: "owner",
            select: "email name.firstName name.lastName phone",
        });

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = updateBooking;
