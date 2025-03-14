const bcrypt = require('bcrypt');
const { generateToken } = require('../../middleware.js');
const User = require('../../models/user.model.js');
require('dotenv').config();

exports.register = async (req, res) => {
    try {
        const { name, email, password, images, bio } = req.body;
        if (!name?.firstName || !name?.lastName || !email || !password) {
            return res.status(400).json({
                message: 'Missing required userInfo fields.',
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'Email already exists.',
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name: {
                firstName: name.firstName,
                lastName: name.lastName,
            },
            email,
            password: hashedPassword,
            images,
            bio,
        });

        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User registered and logged in successfully',
            token,
            userId: user._id.toString(),
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/* {
    "name": {
        "firstName": "Example",
        "lastName": "Example"
    },
    "email": "example@example.com",
    "password": "minLenght 8",
    "images": {
        "imgUrl": "https://example.com/profile.jpg",
        "imgAlt": ""
    },
    "bio": "Optional",
    "role": ""
} */
