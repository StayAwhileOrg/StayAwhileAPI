const Cabin = require("../../models/cabin.model");

exports.getAllCabins = async (req, res) => {
    try {
        const cabins = await Cabin.find();
        res.json(cabins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get all cabins link "http://localhost:3000/cabin"

// [
//     {
//         location: {
//             street: "alibaba",
//             city: "Aspen",
//             postalCode: "81611",
//             country: "USA",
//         },
//         _id: "67d498a661700a9c264132b7",
//         title: "Cozy Mountain Cabin",
//         description: "A beautiful wooden cabin with a mountain view.",
//         images: [
//             {
//                 imgURL: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/383403441.jpg?k=0d70432ce7823f8c3db9ab7f5f71776f2c2d1ea51894802ef3932f147d0cdcfe&o=&hp=1",
//                 imgAlt: "Front view of the cabin",
//                 _id: "67d498a661700a9c264132b8",
//             },
//             {
//                 imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_9cF35yZsTdyL8cVjWTOt9rbCxethc1in4w&s",
//                 imgAlt: "Interior of the cabin",
//                 _id: "67d498a661700a9c264132b9",
//             },
//         ],
//         pricePerNight: 150,
//         capacity: 4,
//         owner: "67d491dc38689bd52bf399b1",
//         createdAt: "2025-03-14T20:59:18.613Z",
//         updatedAt: "2025-03-14T20:59:18.613Z",
//         __v: 0,
//     },
// ];
