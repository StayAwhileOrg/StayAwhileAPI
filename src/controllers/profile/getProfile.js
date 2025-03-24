const User = require("../../models/user.model");

const getProfile = async (req, res) => {
    try {
        const userIdFromToken = req.user;
        const { userId } = req.params;

        if (userIdFromToken !== userId) {
            return res.status(403).json({
                message: "Access Denied: User ID mismatch",
            });
        }

        const profile = await User.findOne({ _id: userId })
            .populate("bookedCabins")
            .populate("postedBookings")
            .lean();

        if (!profile) {
            return res.status(404).json({
                message: "No profile found with matching ID",
            });
        }

        return res.status(200).json({
            message: "Profile successfully fetched",
            profile,
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({
            message: "Internal server error",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

module.exports = getProfile;
