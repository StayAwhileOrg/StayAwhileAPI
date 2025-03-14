exports.getAllCabins = async (req, res) => {
    try {
        const cabins = await Cabin.find();
        res.json(cabins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
