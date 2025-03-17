const User = require('../../models/user.model');

const rateProfile = async (req, res) => {
    try {
        const raterId = req.user;
        const { userId } = req.params;
        const { rating } = req.body;

        if (raterId === userId) {
            return res.status(400).json({
                message: 'You cannot rate your own profile',
            });
        }

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: 'Rating must be a number between 1 and 5',
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'Profile not found',
            });
        }

        const existingRating = user.ratings.find(
            (r) => r.raterId.toString() === raterId
        );
        if (existingRating) {
            return res.status(400).json({
                message: 'You have already rated this profile',
            });
        }

        user.ratings.push({ raterId, rating });
        await user.save();

        return res.status(200).json({
            message: 'Rating successfully added',
            averageRating: user.averageRating,
        });
    } catch (error) {
        console.error('Error rating profile:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined,
        });
    }
};

module.exports = rateProfile;
