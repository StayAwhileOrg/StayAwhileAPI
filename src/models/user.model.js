const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name: {
            firstName: {
                type: String,
                required: [true, 'First name is required'],
                trim: true,
                maxlength: [50, 'First name cannot exceed 50 characters'],
            },
            lastName: {
                type: String,
                required: [true, 'Last name is required'],
                trim: true,
                maxlength: [50, 'Last name cannot exceed 50 characters'],
            },
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            match: [
                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                'Please enter a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false,
        },
        phone: {
            type: Number,
            trim: true,
            maxlength: 8,
            minlength: 8,
        },
        images: {
            imgUrl: {
                type: String,
                required: [true, 'Profile image URL is required'],
                trim: true,
            },
            imgAlt: {
                type: String,
                default: 'Profile image',
                trim: true,
            },
        },
        bio: {
            type: String,
            trim: true,
            maxlength: 400,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    { timestamps: true }
);

// rating
// all booking by profile

const User = mongoose.model('User', UserSchema);
module.exports = User;
