const Booking = require('../../models/booking.model');
const mongoose = require('mongoose');

const updateBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        if (!bookingId || !mongoose.isValidObjectId(bookingId)) {
            return res
                .status(400)
                .json({ message: 'Valid Booking ID is required' });
        }

        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { status } = req.body;
        const validStatuses = [
            'available',
            'pending',
            'confirmed',
            'cancelled',
        ];
        if (
            Object.keys(req.body).length > 1 ||
            (status && !validStatuses.includes(status))
        ) {
            return res.status(400).json({
                message:
                    'Only status can be updated and must be one of: available, pending, confirmed, cancelled',
            });
        }

        const updatedBooking = await Booking.findOneAndUpdate(
            {
                _id: bookingId,
                $or: [{ guest: req.user }, { owner: req.user }],
            },
            { status: status || booking.status },
            {
                new: true,
                runValidators: true,
            }
        ).populate({
            path: 'owner',
            select: 'email name.firstName name.lastName phone',
        });

        if (!updatedBooking) {
            return res.status(404).json({
                message:
                    'Booking not found or you are not authorized to update it',
            });
        }

        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({
            message: 'Server error',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined,
        });
    }
};

module.exports = updateBooking;
