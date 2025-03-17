const Cabin = require("../../models/cabin.model");

const getAllCabins = async (req, res) => {
    try {
        const {
            title,
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
        } = req.query;

        let query = {};

        if (title) {
            query.title = { $regex: title, $options: "i" };
        }
        if (city) {
            query["location.city"] = { $regex: city, $options: "i" };
        }
        if (country) {
            query["location.country"] = { $regex: country, $options: "i" };
        }
        if (capacity) {
            query["facilities.capacity"] = Number(capacity);
        }
        if (beds) {
            query["facilities.beds"] = Number(beds);
        }
        if (petsAllowed !== undefined) {
            query["facilities.petsAllowed"] =
                petsAllowed.toLowerCase() === "true";
        }
        if (smokingAllowed !== undefined) {
            query["facilities.smokingAllowed"] =
                smokingAllowed.toLowerCase() === "true";
        }
        if (electricity !== undefined) {
            query["facilities.electricity"] =
                electricity.toLowerCase() === "true";
        }
        if (water !== undefined) {
            query["facilities.water"] = water.toLowerCase() === "true";
        }
        if (wifi !== undefined) {
            query["facilities.wifi"] = wifi.toLowerCase() === "true";
        }
        if (jacuzzi !== undefined) {
            query["facilities.jacuzzi"] = jacuzzi.toLowerCase() === "true";
        }

        let sortOption = {};
        if (
            sortOrder &&
            (sortOrder.toLowerCase() === "asc" ||
                sortOrder.toLowerCase() === "desc")
        ) {
            sortOption.pricePerNight =
                sortOrder.toLowerCase() === "asc" ? 1 : -1;
        } else {
            sortOption.createdAt = -1;
        }

        const cabins = await Cabin.find(query)
            .populate({
                path: "owner",
                select: "email name.firstName name.lastName phone",
            })
            .sort(sortOption);

        res.status(200).json(cabins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = getAllCabins;
