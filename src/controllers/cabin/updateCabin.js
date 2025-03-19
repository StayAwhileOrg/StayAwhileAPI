const Cabin = require('../../models/cabin.model');
const User = require('../../models/user.model.js');

const updateCabin = async (req, res) => {
    try {
        const { cabinId } = req.params;
        const updateData = req.body;

        if (!cabinId || !cabinId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid cabin ID format' });
        }

        const user = await User.findById(req.user);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const cabin = await Cabin.findById(cabinId);
        if (!cabin) {
            return res.status(404).json({ message: 'Cabin not found' });
        }

        if (cabin.owner.toString() !== req.user.toString()) {
            return res.status(403).json({
                message: 'Forbidden: You can only update your own cabins',
            });
        }

        const restrictedFields = ['owner', 'createdAt'];
        restrictedFields.forEach((field) => delete updateData[field]);

        if (updateData.title) updateData.title = updateData.title.trim();
        if (updateData.description)
            updateData.description = updateData.description.trim();
        if (updateData.location) {
            if (updateData.location.street)
                updateData.location.street = updateData.location.street.trim();
            if (updateData.location.city)
                updateData.location.city = updateData.location.city.trim();
            if (updateData.location.postalCode)
                updateData.location.postalCode =
                    updateData.location.postalCode.trim();
            if (updateData.location.country)
                updateData.location.country =
                    updateData.location.country.trim();
        }
        if (updateData.images) {
            updateData.images = updateData.images.map((img) => ({
                imgURL: img.imgURL?.trim(),
                imgAlt: img.imgAlt?.trim() || 'image',
            }));
        }

        const updatedCabin = await Cabin.findByIdAndUpdate(
            cabinId,
            {
                ...updateData,
                lastModifiedBy: req.user,
                updatedAt: new Date(),
            },
            {
                new: true,
                runValidators: true,
                context: 'query',
            }
        ).populate({
            path: 'owner',
            select: 'email name.firstName name.lastName phone',
        });

        if (!updatedCabin) {
            return res.status(404).json({ message: 'Cabin not found' });
        }

        res.status(200).json({
            message: 'Cabin updated successfully',
            data: updatedCabin,
        });
    } catch (error) {
        console.error('Update cabin error:', {
            message: error.message,
            stack: error.stack,
            cabinId: req.params.cabinId,
            userId: req.user,
        });

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(
                (err) => err.message
            );
            return res.status(400).json({ message: messages.join(', ') });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid cabin ID' });
        }

        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

module.exports = updateCabin;
