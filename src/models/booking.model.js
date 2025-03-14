const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },
        cabin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cabin",
            required: [true, "Cabin is required"],
        },
        startDate: {
            type: Date,
            required: [true, "Start date is required"],
            validate: {
                validator: (value) => value >= new Date(),
                message: "Start date must be today or in the future",
            },
        },
        endDate: {
            type: Date,
            required: [true, "End date is required"],
            validate: {
                validator: function (value) {
                    return value > this.startDate;
                },
                message: "End date must be after start date",
            },
        },
        totalPrice: {
            type: Number,
            required: [true, "Total price is required"],
            min: [0, "Total price cannot be negative"],
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
module.exports = Booking;
