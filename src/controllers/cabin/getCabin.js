const Cabin = require("../../models/cabin.model");

const getCabin = async (req, res) => {
    try {
        const { cabinId } = req.params;

        if (!cabinId || !cabinId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid cabin ID format" });
        }

        const cabin = await Cabin.findById(cabinId)
            .populate({
                path: "owner",
                select: "email name.firstName name.lastName phone image.imgUrl image.imgAlt",
            })
            .lean();

        if (cabin && (!cabin.images || cabin.images.length === 0)) {
            cabin.images = [
                {
                    imgURL: "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg",
                    imgAlt: "No image available",
                },
            ];
        }

        if (!cabin) {
            return res.status(404).json({ message: "Cabin not found" });
        }

        res.status(200).json({
            data: cabin,
            message: "Cabin retrieved successfully",
        });
    } catch (error) {
        console.error("Get cabin error:", {
            message: error.message,
            stack: error.stack,
            cabinId: req.params.cabinId,
        });

        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid cabin ID" });
        }

        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

module.exports = getCabin;
