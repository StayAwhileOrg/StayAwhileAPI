const Cabin = require("../../models/cabin.model");

const updateCabin = async (req, res) => {
    try {
        const { cabinId } = req.params;
        const updatedCabin = await Cabin.findByIdAndUpdate(cabinId, req.body, {
            new: true,
            runValidators: true,
        }).populate({
            path: "owner",
            select: "email name.firstName name.lastName phone",
        });

        if (!updatedCabin) {
            return res.status(404).json({ message: "Cabin not found" });
        }

        res.status(200).json(updatedCabin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = updateCabin;
