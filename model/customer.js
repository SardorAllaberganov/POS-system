const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
});

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
        dob: Date,
        phone: {
            type: String,
            required: true,
        },
        addresses: [addressSchema],
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
