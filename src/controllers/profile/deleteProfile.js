const User = require('../../models/user.model');

const deleteProfile = async (req, res) => {
    try {
        const userIdFromToken = req.user;
        const { userId } = req.params;

        if (userIdFromToken !== userId) {
            return res.status(403).json({
                message: 'Access Denied: You can only delete your own profile',
            });
        }

        const deletedProfile = await User.findOneAndDelete({ _id: userId });

        if (!deletedProfile) {
            return res.status(404).json({
                message: 'No profile found with matching ID',
            });
        }

        return res.status(200).json({
            message: 'Profile successfully deleted',
            deletedProfileId: userId,
        });
    } catch (error) {
        console.error('Error deleting profile:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined,
        });
    }
};

module.exports = deleteProfile;
