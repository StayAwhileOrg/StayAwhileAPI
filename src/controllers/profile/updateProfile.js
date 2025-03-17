const User = require('../../models/user.model');

const updateProfile = async (req, res) => {
    try {
        const userIdFromToken = req.user;
        const { userId } = req.params;
        const updateData = req.body;

        if (userIdFromToken !== userId) {
            return res.status(403).json({
                message: 'Access Denied: User ID mismatch',
            });
        }

        const allowedFields = ['images.imgUrl', 'images.imgAlt', 'bio'];

        const filteredData = {};
        for (const key in updateData) {
            if (allowedFields.includes(key)) {
                filteredData[key] = updateData[key];
            }
        }

        const profile = await User.findOneAndUpdate(
            { _id: userId },
            { $set: filteredData },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({
                message: 'No profile found with matching ID',
            });
        }

        return res.status(200).json({
            message: 'Profile successfully updated',
            profile,
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined,
        });
    }
};

module.exports = updateProfile;
