const Cabin = require("../../models/cabin.model");

const getCabin = async (req, res) => {
    try {
        const { cabinId } = req.params;
        const cabin = await Cabin.findById(cabinId).populate({
            path: "owner",
            select: "email name.firstName name.lastName phone",
        });

        if (!cabin) {
            return res.status(404).json({ message: "Cabin not found" });
        }
        res.status(200).json(cabin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = getCabin;
