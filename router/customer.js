const express = require("express");
const router = express.Router();
const customerController = require("../controller/customer");
const Customer = require("../model/customer");
const { isAuth, isAdmin, isManager } = require("../helper/is-auth");
const { body } = require("express-validator");

router.get("/", /*isAuth,*/ customerController.getAllCustomers);
router.get("/search", customerController.searchCustomer);
router.get("/:id", /*isAuth,*/ customerController.getCustomer);
router.post(
	"/create",
	/*isAuth,*/ [
		body("firstname").not().isEmpty().withMessage("firstname_is_empty"),
		body("lastname").not().isEmpty().withMessage("lastname_is_empty"),
		body("phone")
			.not()
			.isEmpty()
			.withMessage("phone_is_empty")
			.custom(async (value, { req }) => {
				return Customer.findOne({ phone: value }).then((customer) => {
					if (customer) {
						return Promise.reject("phone_already_exists");
					}
				});
			}),
		body("email")
			.isEmail()
			.withMessage("invalid_email_address")
			.custom(async (value, { req }) => {
				return Customer.findOne({ email: value }).then((customer) => {
					if (customer) {
						return Promise.reject("email_already_exists");
					}
				});
			})
			.normalizeEmail(),
	],
	customerController.createCustomer
);

router.post(
	"/edit/:id",
	/*isAuth,*/ [
		body("firstname").not().isEmpty().withMessage("firstname_is_empty"),
		body("lastname").not().isEmpty().withMessage("lastname_is_empty"),
		body("phone").not().isEmpty().withMessage("phone_is_empty"),
		body("email")
			.isEmail()
			.withMessage("invalid_email_address")
			.normalizeEmail(),
	],
	customerController.editCustomer
);

router.delete(
	"/delete/:id",
	/*isAuth, isAdmin,*/ customerController.deleteCustomer
);

router.get("/orders/:id", customerController.customerOrderHistory);

module.exports = router;
