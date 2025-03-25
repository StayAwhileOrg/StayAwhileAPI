const Cabin = require('../../models/cabin.model.js');
const User = require('../../models/user.model.js');

const rateCabin = async (req, res) => {
    try {
        const raterId = req.user;
        const { cabinId } = req.params;
        const { rating } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: 'Rating must be a number between 1 and 5',
            });
        }

        const cabin = await Cabin.findById(cabinId);
        if (!cabin) {
            return res.status(404).json({ message: 'Cabin not found' });
        }

        if (cabin.owner.toString() === raterId.toString()) {
            return res.status(400).json({
                message: 'You cannot rate your own cabin',
            });
        }

        const user = await User.findById(raterId);
        if (!user) {
            return res.status(400).json({ message: 'Profile not found' });
        }

        const existingRatingIndex = cabin.rating.findIndex(
            (r) => r.user.toString() === raterId.toString()
        );

        if (existingRatingIndex !== -1) {
            cabin.rating[existingRatingIndex].value = rating;
        } else {
            cabin.rating.push({
                user: raterId,
                value: rating,
            });
        }

        const totalRating = cabin.rating.reduce((sum, r) => sum + r.value, 0);
        cabin.averageRating = totalRating / cabin.rating.length;

        await cabin.save();

        return res.status(200).json({
            message: 'Cabin rated successfully',
            rating: rating,
            averageRating: cabin.averageRating,
            totalRatings: cabin.rating.length,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

module.exports = rateCabin;
