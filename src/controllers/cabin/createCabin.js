const Cabin = require("../../models/cabin.model");
const mongoose = require("mongoose");

exports.createCabin = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const cabinData = { ...req.body, owner: userId };

        const newCabin = new Cabin(cabinData);
        const savedCabin = await newCabin.save();

        res.status(201).json(savedCabin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// test user id "67d491dc38689bd52bf399b1"

// create cabin link: "http://localhost:3000/cabin/userId"
// full link would be "http://localhost:3000/cabin/67d491dc38689bd52bf399b1" ++ sending bearer token in head

// format
// {
//     "title": "Cozy Mountain Cabin",
//     "description": "A beautiful wooden cabin with a mountain view.",
//     "images": [
//       {
//         "imgURL": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/383403441.jpg?k=0d70432ce7823f8c3db9ab7f5f71776f2c2d1ea51894802ef3932f147d0cdcfe&o=&hp=1",
//         "imgAlt": "Front view of the cabin"
//       },
//       {
//         "imgURL": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_9cF35yZsTdyL8cVjWTOt9rbCxethc1in4w&s",
//         "imgAlt": "Interior of the cabin"
//       }
//     ],
//     "location": {
//       "street": "alibaba",
//       "city": "Aspen",
//       "postalCode": "81611",
//       "country": "USA"
//     },
//     "pricePerNight": 150,
//     "capacity": 4
//   }
