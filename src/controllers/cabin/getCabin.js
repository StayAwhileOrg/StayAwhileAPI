exports.getCabin = async (req, res) => {
    try {
        const { cabinId } = req.params;
        const cabin = await Cabin.findById(cabinId);
        if (!cabin) {
            return res.status(404).json({ msg: "Cabin not found" });
        }
        res.json(cabin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
