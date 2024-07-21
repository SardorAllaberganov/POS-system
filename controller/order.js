const Order = require("../model/order");
const Product = require("../model/product");
const Customer = require("../model/customer");
const isValidId = require("../helper/is-valid-id");
const errorMessage = require("../helper/errorMessage");
const { validationResult } = require("express-validator");

exports.getAllOrders = (req, res, next) => {
	Order.find()
		.populate("customerId")
		.populate("items.productId")
		.then((orders) => {
			if (!orders) errorMessage(req.t("orders_not_found"), 404);
			return res.status(200).json({
				message: req.t("orders_fetched_successfully"),
				data: orders,
			});
		})
		.catch((error) => next(error));
};

exports.createOrder = async (req, res, next) => {
	const { customerId, items } = req.body;

	const customer = await Customer.findById(customerId);
	if (!customer) errorMessage(req.t("customer_not_found"), 404);
	let totalAmount = 0;
	for (let item of items) {
		Product.findById(item.productId)
			.then((product) => {
				if (!product) errorMessage(req.t("product_not_found"), 404);
				totalAmount += product.price * item.quantity;
			})
			.catch((error) => next(error));
	}
	const order = new Order({
		customerId,
		items,
		totalAmount,
		status: "Pending",
	});
	order
		.save()
		.then((result) => {
			return res.status(200).json({
				message: req.t("order_created_successfully"),
				data: result,
			});
		})
		.catch((error) => next(error));
};
