const Cabin = require("../../models/cabin.model.js");

exports.deleteCabin = async (req, res) => {
    try {
        const { cabinId } = req.params;
        const cabin = await Cabin.findByIdAndDelete(cabinId);
        if (!cabin) {
            return res.status(404).json({ msg: "Cabin not found" });
        }
        res.json({ msg: "Cabin deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
