const Booking = require('../../models/booking.model');
const User = require('../../models/user.model');
const Cabin = require('../../models/cabin.model');

const createBooking = async (req, res) => {
    try {
        const userId = req.user;
        const { cabinId, startDate, endDate, totalPrice } = req.body;

        if (!cabinId || !startDate || !endDate || totalPrice === undefined) {
            return res.status(400).json({
                message:
                    'cabinId, startDate, endDate, and totalPrice are required',
            });
        }

        const cabin = await Cabin.findById(cabinId);
        if (!cabin) {
            return res.status(404).json({
                message: 'Cabin not found',
            });
        }

        if (cabin.owner.toString() === userId.toString()) {
            return res
                .status(400)
                .json({ message: 'You cannot book your own cabin' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                message:
                    'Invalid date format. Use ISO 8601 (e.g., "2025-04-01")',
            });
        }

        if (start >= end) {
            return res.status(400).json({
                message: 'End date must be after start date',
            });
        }

        const conflictingBooking = await Booking.findOne({
            cabin: cabinId,
            status: 'confirmed',
            $or: [
                {
                    startDate: { $lte: end },
                    endDate: { $gte: start },
                },
            ],
        });

        if (conflictingBooking) {
            return res.status(400).json({
                message: 'Cabin is already booked for the selected dates',
                conflictingDates: {
                    start: conflictingBooking.startDate,
                    end: conflictingBooking.endDate,
                },
            });
        }

        const booking = new Booking({
            guest: userId,
            cabin: cabinId,
            owner: cabin.owner,
            startDate: start,
            endDate: end,
            totalPrice,
            status: 'pending',
        });

        await booking.save();

        await User.findByIdAndUpdate(userId, {
            $push: { bookedCabins: booking._id },
        });

        await User.findByIdAndUpdate(cabin.owner, {
            $push: { postedBookings: booking._id },
        });

        const populatedBooking = await Booking.findById(booking._id)
            .populate({
                path: 'guest',
                select: 'name.firstName name.lastName email phone',
            })
            .populate({
                path: 'owner',
                select: 'name.firstName name.lastName email phone',
            })
            .lean();

        return res.status(201).json({
            message: 'Booking created successfully',
            booking: populatedBooking,
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined,
        });
    }
};

module.exports = createBooking;
