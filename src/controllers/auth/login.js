const bcrypt = require('bcrypt');
const { generateToken } = require('../../middleware.js');
const User = require('../../models/user.model.js');
require('dotenv').config();

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email }).select('+password').lean();
        if (!user) {
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Login successful',
            token,
            userId: user._id.toString(),
        });
    } catch (error) {
        console.error('Login error:', {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
};

/* {
    "email": "truls@example.com",
    "password": "SecurePass123"
} */
