const bcrypt = require("bcrypt");
const { generateToken } = require("../../middleware.js");
const User = require("../../models/user.model.js");
require("dotenv").config();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email }).select("+password").lean();
        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        const token = generateToken(user._id);

        const safeUser = {
            _id: user._id,
            name: {
                firstName: user.name.firstName,
                lastName: user.name.lastName,
            },
            email: user.email,
            images: {
                imgUrl: user.images.imgUrl,
                imgAlt: user.images.imgAlt,
            },
            bio: user.bio || '',
            averageRating: user.averageRating,
        };

        res.status(200).json({
            message: "Login successful",
            user: safeUser,
            token,
            userId: user._id.toString(),
        });
    } catch (error) {
        console.error("Login error:", {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({ message: "An unexpected error occurred" });
    }
};

module.exports = login;
