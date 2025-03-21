const Booking = require('../../models/booking.model.js');

const getBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        if (!bookingId) {
            return res.status(400).json({ message: 'Booking ID is required' });
        }

        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const booking = await Booking.findOne({
            _id: bookingId,
            $or: [{ guest: req.user }, { owner: req.user }],
        })
            .populate('guest', 'name email phone')
            .populate('cabin')
            .populate('owner', 'name email phone');

        if (!booking) {
            return res.status(404).json({
                message:
                    'Booking not found or you are not authorized to view it',
            });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined,
        });
    }
};

module.exports = getBooking;
