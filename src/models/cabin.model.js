const mongoose = require("mongoose");

const CabinSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Cabin name is required"],
            trim: true,
            maxlength: [100, "Cabin name cannot exceed 100 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [400, "Description cannot exceed 500 characters"],
        },
        images: {
            type: [
                {
                    imgURL: { type: String, required: true },
                    imgAlt: { type: String, default: "image" },
                },
            ],
            required: true,
            validate: {
                validator: function (value) {
                    return value.length > 0;
                },
                message: "At least one image is required",
            },
        },
        location: {
            street: {
                type: String,
                required: [true, "Street is required"],
                trim: true,
            },
            city: {
                type: String,
                required: [true, "City is required"],
                trim: true,
            },
            postalCode: {
                type: String,
                required: [true, "Postal code is required"],
                trim: true,
            },
            country: {
                type: String,
                required: [true, "Country is required"],
                trim: true,
            },
        },
        pricePerNight: {
            type: Number,
            required: [true, "Price per night is required"],
            min: [0, "Price cannot be negative"],
        },
        capacity: {
            type: Number,
            required: [true, "Capacity is required"],
            min: [1, "Capacity must be at least 1"],
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Owner is required"],
        },
    },
    { timestamps: true }
);

const Cabin = mongoose.model("cabin", CabinSchema);
module.exports = Cabin;
