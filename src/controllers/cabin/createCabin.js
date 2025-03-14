exports.createCabin = async (req, res) => {
    try {
        const { userId } = req.params;
        const cabinData = { ...req.body, owner: userId };

        const newCabin = new Cabin(cabinData);
        const savedCabin = await newCabin.save();
        res.status(201).json(savedCabin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
