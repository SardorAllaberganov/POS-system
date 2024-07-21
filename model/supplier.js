const mongoose = require("mongoose");

const supplierSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		contactInfo: {
			email: {
				type: String,
				required: true,
			},
			phone: {
				type: String,
				required: true,
			},
		},
		address: {
			street: {
				type: String,
				required: true,
			},
			city: {
				type: String,
				required: true,
			},
			country: {
				type: String,
				required: true,
			},
			postalCode: {
				type: String,
				required: true,
			},
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Supplier", supplierSchema);
