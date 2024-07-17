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
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
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
