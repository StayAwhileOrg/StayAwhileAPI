const Cabin = require("../../models/cabin.model");

const deleteCabin = async (req, res) => {
    try {
        const { cabinId } = req.params;
        const cabin = await Cabin.findById(cabinId);

        if (!cabin) {
            return res.status(404).json({ message: "Cabin not found" });
        }

        await Cabin.findByIdAndDelete(cabinId);

        res.status(200).json({ message: "Cabin successfully deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = deleteCabin;
