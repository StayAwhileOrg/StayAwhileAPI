const Cabin = require("../../models/cabin.model");

const getAllCabins = async (req, res) => {
    try {
        const {
            search,
            city,
            country,
            sortOrder,
            capacity,
            beds,
            petsAllowed,
            smokingAllowed,
            electricity,
            water,
            wifi,
            jacuzzi,
            page = 1,
            limit = 10,
        } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search.trim(), $options: "i" } },
                { description: { $regex: search.trim(), $options: "i" } },
            ];
        }

        if (city) {
            query["location.city"] = { $regex: city.trim(), $options: "i" };
        }
        if (country) {
            query["location.country"] = {
                $regex: country.trim(),
                $options: "i",
            };
        }

        if (capacity) {
            const numCapacity = Number(capacity);
            if (isNaN(numCapacity) || numCapacity < 1) {
                return res
                    .status(400)
                    .json({ message: "Capacity must be a positive number" });
            }
            query["facilities.capacity"] = numCapacity;
        }
        if (beds) {
            const numBeds = Number(beds);
            if (isNaN(numBeds) || numBeds < 1) {
                return res
                    .status(400)
                    .json({ message: "Beds must be a positive number" });
            }
            query["facilities.beds"] = numBeds;
        }

        const booleanFields = {
            petsAllowed,
            smokingAllowed,
            electricity,
            water,
            wifi,
            jacuzzi,
        };
        Object.entries(booleanFields).forEach(([field, value]) => {
            if (value !== undefined) {
                const boolValue = value.toLowerCase() === "true";
                query[`facilities.${field}`] = boolValue;
            }
        });

        const sortOption = {};
        if (sortOrder && ["asc", "desc"].includes(sortOrder.toLowerCase())) {
            sortOption.pricePerNight =
                sortOrder.toLowerCase() === "asc" ? 1 : -1;
        } else {
            sortOption.createdAt = -1;
        }

        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.max(1, Math.min(50, Number(limit)));
        const skip = (pageNum - 1) * limitNum;

        const [cabins, total] = await Promise.all([
            Cabin.find(query)
                .populate({
                    path: "owner",
                    select: "email name.firstName name.lastName phone",
                })
                .sort(sortOption)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Cabin.countDocuments(query),
        ]);

        res.status(200).json({
            data: cabins,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalItems: total,
                itemsPerPage: limitNum,
            },
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res
                .status(400)
                .json({ message: "Invalid query parameter format" });
        }

        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

module.exports = getAllCabins;
