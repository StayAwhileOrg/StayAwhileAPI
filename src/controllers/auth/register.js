const bcrypt = require("bcrypt");
const { generateToken } = require("../../middleware.js");
const User = require("../../models/user.model.js");
require("dotenv").config();

const register = async (req, res) => {
    try {
        const { name, email, password, image = null, bio, phone } = req.body;
        if (!name?.firstName || !name?.lastName || !phone || !email || !password) {
            return res.status(400).json({
                message: "Missing required userInfo fields.",
            });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { phone }],
        });
        if (existingUser) {
            let conflictField =
                existingUser.email === email ? 'Email' : 'Phone number';
            return res.status(400).json({
                message: `${conflictField} already exists.`,
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
            phone,
            image,
            bio,
        });

        const token = generateToken(user._id);

        const safeUser = {
            _id: user._id.toString(),
            name: {
                firstName: user.name.firstName,
                lastName: user.name.lastName,
            },
            email: user.email,
            phone: user.phone,
            image: {
                imgUrl: user.image.imgUrl,
                imgAlt: user.image.imgAlt,
            },
            bio: user.bio || '',
            averageRating: user.averageRating,
        };

        res.status(201).json({
            message: "User registered and logged in successfully",
            user: safeUser,
            token,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = register;
