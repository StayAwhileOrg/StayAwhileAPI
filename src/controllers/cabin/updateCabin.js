exports.updateCabin = async (req, res) => {
    try {
        const { cabinId } = req.params;
        const updatedCabin = await Cabin.findByIdAndUpdate(cabinId, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedCabin) {
            return res.status(404).json({ msg: "Cabin not found" });
        }
        res.json(updatedCabin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
