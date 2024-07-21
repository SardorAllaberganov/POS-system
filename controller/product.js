const errorMessage = require("../helper/errorMessage");
const isValidId = require("../helper/is-valid-id");
const Product = require("../model/product");

exports.getAllProducts = (req, res, next) => {
	Product.find()
		.then((products) => {
			if (!products) errorMessage(req.t("products_not_found"), 404);
			return res.status(200).json({
				message: req.t("products_fetched_successfully"),
				data: products,
			});
		})
		.catch((error) => next(error));
};

exports.getProduct = (req, res, next) => {
	const productId = req.params.id;
	if (isValidId(productId)) {
		Product.findById(productId)
			.then((product) => {
				if (!product) errorMessage(req.t("product_not_found"), 404);
				return res.status(200).json({
					message: req.t("product_fetched_successfully"),
					data: product,
				});
			})
			.catch((error) => next(error));
	} else {
		return res.status(400).json({ message: req.t("invalid_product_id") });
	}
};

exports.createProduct = (req, res, next) => {};
