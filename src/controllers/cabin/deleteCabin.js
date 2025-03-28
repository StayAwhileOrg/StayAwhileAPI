const Cabin = require('../../models/cabin.model');
const User = require('../../models/user.model.js');
const Booking = require('../../models/booking.model.js');

const deleteCabin = async (req, res) => {
    try {
        const { cabinId } = req.params;

        if (!cabinId || !cabinId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid cabin ID format' });
        }

        const cabin = await Cabin.findById(cabinId);
        if (!cabin) {
            return res.status(404).json({ message: 'Cabin not found' });
        }

        const user = await User.findById(req.user);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const bookings = await Booking.find({ cabin: cabinId });
        if (bookings.length > 0) {
            await Booking.deleteMany({ cabin: cabinId });
        }

        await Cabin.findByIdAndDelete(cabinId);

        res.status(200).json({
            message: 'Cabin and associated bookings successfully deleted',
            cabinId: cabinId,
            deletedBookingsCount: bookings.length,
        });
    } catch (error) {
        console.error('Delete cabin error:', {
            message: error.message,
            stack: error.stack,
            cabinId: req.params.cabinId,
            userId: req.user,
        });

        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid cabin ID' });
        }

        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

module.exports = deleteCabin;
