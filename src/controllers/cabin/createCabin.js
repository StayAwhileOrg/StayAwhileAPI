const Cabin = require('../../models/cabin.model');
const User = require('../../models/user.model');
const mongoose = require('mongoose');

const createCabin = async (req, res) => {
    try {
        const userIdFromToken = req.user;
        const { userId } = req.params;

        if (userIdFromToken !== userId) {
            return res.status(403).json({
                message:
                    'Access Denied: You can only create cabins for yourself',
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: 'Invalid user ID',
            });
        }

        const cabinData = { ...req.body, owner: userId };
        const newCabin = new Cabin(cabinData);
        const savedCabin = await newCabin.save();

        await User.findByIdAndUpdate(userId, {
            $push: { postedCabins: savedCabin._id },
        });

        return res.status(201).json({
            message: 'Cabin created successfully',
            cabin: savedCabin,
        });
    } catch (error) {
        console.error('Error creating cabin:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined,
        });
    }
};

module.exports = createCabin;
