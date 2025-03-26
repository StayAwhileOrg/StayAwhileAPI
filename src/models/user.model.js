const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: {
            firstName: {
                type: String,
                required: [true, "First name is required"],
                trim: true,
                maxlength: [50, "First name cannot exceed 50 characters"],
            },
            lastName: {
                type: String,
                required: [true, "Last name is required"],
                trim: true,
                maxlength: [50, "Last name cannot exceed 50 characters"],
            },
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            match: [
                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                "Please enter a valid email address",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false,
        },
        phone: {
            type: Number,
            trim: true,
            maxlength: 8,
            minlength: 8,
            required: true,
        },
        image: {
            imgUrl: {
                type: String || null,
                required: [false, "Profile image URL is required"],
                trim: true,
            },
            imgAlt: {
                type: String,
                default: "Profile image",
                trim: true,
            },
        },
        bio: {
            type: String,
            trim: true,
            maxlength: 400,
            default: "",
        },
        ratings: [
            {
                raterId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                    min: [1, "Rating must be at least 1"],
                    max: [5, "Rating cannot exceed 5"],
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        averageRating: {
            type: Number,
            min: 1,
            max: 5,
            default: null,
        },
        bookedCabins: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Booking",
            },
        ],
        postedBookings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Booking",
            },
        ],
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    { timestamps: true }
);

UserSchema.pre("save", function (next) {
    if (this.isModified("ratings")) {
        const totalRatings = this.ratings.length;
        if (totalRatings > 0) {
            const sum = this.ratings.reduce(
                (acc, curr) => acc + curr.rating,
                0
            );
            this.averageRating = sum / totalRatings;
        } else {
            this.averageRating = null;
        }
    }
    next();
});

UserSchema.pre(/^find/, function (next) {
    this.populate("bookedCabins").populate("postedBookings");
    next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
