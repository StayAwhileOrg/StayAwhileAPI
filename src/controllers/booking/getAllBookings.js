const Booking = require('../../models/booking.model.js');
const User = require('../../models/user.model');

const getAllBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        const requestUser = await User.findById(req.user);

        if (req.user.toString() !== userId || !requestUser) {
            return res.status(403).json({
                message: 'You do not have access to these bookings',
            });
        }

        const bookings = await Booking.find({
            $or: [
                { guest: userId },
                { owner: userId },
            ],
        })
            .populate('cabin')
            .populate('owner', 'name email phone')
            .populate('guest', 'name email phone')
            .sort({ startDate: 1 });

        if (bookings.length === 0) {
            return res.status(404).json({
                message: 'No bookings found for this user',
            });
        }

        res.status(200).json(bookings);
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

module.exports = getAllBookings;
