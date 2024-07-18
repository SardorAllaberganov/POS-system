const mongoose = require("mongoose");

const customerSchema = mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        email: String,
        dob: { type: Date, trim: true },
        phone: {
            type: String,
            required: true,
        },
        address: {
            street: String,
            city: String,
            state: String,
            country: String,
            postalCode: String,
        },
        loyaltyPoints: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Customer", customerSchema);
