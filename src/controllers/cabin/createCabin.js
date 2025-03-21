const Cabin = require("../../models/cabin.model");
const User = require("../../models/user.model");
const mongoose = require("mongoose");

const createCabin = async (req, res) => {
    try {
        const userIdFromToken = req.user;
        const { userId } = req.params;

        if (userIdFromToken !== userId) {
            return res.status(403).json({
                message:
                    "Access Denied: You can only create cabins for yourself",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID",
            });
        }

        const {
            title,
            description,
            images,
            location,
            pricePerNight,
            facilities,
        } = req.body;

        if (
            !title ||
            !description ||
            !images ||
            !location ||
            !pricePerNight ||
            !facilities
        ) {
            return res.status(400).json({
                message: "Validation error: Missing required fields",
                errors: [
                    !title ? "Title is required" : null,
                    !description ? "Description is required" : null,
                    !images ? "Images are required" : null,
                    !location ? "Location is required" : null,
                    !pricePerNight ? "Price per night is required" : null,
                    !facilities ? "Facilities are required" : null,
                ].filter(Boolean),
            });
        }

        if (
            !location.street ||
            !location.city ||
            !location.postalCode ||
            !location.country
        ) {
            return res.status(400).json({
                message:
                    "Validation error: Missing required fields in location",
                errors: [
                    !location.street ? "Street is required" : null,
                    !location.city ? "City is required" : null,
                    !location.postalCode ? "Postal code is required" : null,
                    !location.country ? "Country is required" : null,
                ].filter(Boolean),
            });
        }

        if (!facilities.capacity || !facilities.beds) {
            return res.status(400).json({
                message:
                    "Validation error: Missing required fields in facilities",
                errors: [
                    !facilities.capacity ? "Capacity is required" : null,
                    !facilities.beds ? "Number of beds is required" : null,
                ].filter(Boolean),
            });
        }

        if (images.length === 0) {
            return res.status(400).json({
                message: "At least one image is required",
            });
        }

        const cabinData = { ...req.body, owner: userId };
        const newCabin = new Cabin(cabinData);
        const savedCabin = await newCabin.save();

        await User.findByIdAndUpdate(userId, {
            $push: { postedCabins: savedCabin._id },
        });

        await savedCabin.populate(
            "owner",
            "email name.firstName name.lastName phone"
        );

        return res.status(201).json({
            message: "Cabin created successfully",
            cabin: savedCabin,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Validation error",
                errors: Object.values(error.errors).map((err) => err.message),
            });
        }

        return res.status(500).json({
            message: "Internal server error",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

module.exports = createCabin;
