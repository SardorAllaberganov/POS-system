const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 5,
        },
        role: {
            type: String,
            enum: ["admin", "cashier", "manager"],
            default: "cashier",
        },
        permissions: {
            view: {
                type: Boolean,
                default: true,
            },
            create: {
                type: Boolean,
                default: false,
            },
            update: {
                type: Boolean,
                default: false,
            },
            delete: {
                type: Boolean,
                default: false,
            },
        },
        phoneNumber: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
