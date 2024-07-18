const Customer = require("../model/customer");
const isValidId = require("../helper/is-valid-id");
const { validationResult } = require("express-validator");
const errorMessage = require("../helper/errorMessage");

exports.getAllCustomers = (req, res, next) => {
    Customer.find()
        .then((customers) => {
            if (!customers) {
                errorMessage(req.t("no_customers_found"), 404);
            }
            return res.status(200).json({
                message: req.t("customer_fetched_successfully"),
                data: customers,
            });
        })
        .catch((error) => {
            next(error);
        });
};

exports.getCustomer = (req, res, next) => {
    const id = req.params.id;
    if (isValidId(id)) {
        Customer.findById(id)
            .then((customer) => {
                if (!customer) {
                    errorMessage(req.t("customer_not_found"), 404);
                }
                return res.status(200).json({
                    message: req.t("customer_fetched_successfully"),
                    data: customer,
                });
            })
            .catch((error) => {
                next(error);
            });
    } else {
        return res.status(400).json({ message: req.t("invalid_user_id") });
    }
};

exports.createCustomer = (req, res, next) => {
    const { firstname, lastname, email, dob, phone, addresses } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errorMessage(req.t("validation_failed"), 422, errors);
    }
    const customer = new Customer({
        firstname,
        lastname,
        email,
        dob,
        phone,
        addresses,
    });
    return customer
        .save()
        .then((customer) => {
            return res.status(201).json({
                message: req.t("customer_created_successfully"),
                data: customer,
            });
        })
        .catch((error) => next(error));
};
exports.editCustomer = (req, res, next) => {
    const id = req.params.id;
    
};
exports.deleteCustomer = (req, res, next) => {};
exports.searchCustomer = (req, res, next) => {};
exports.addLoyaltyPoints = (req, res, next) => {};
exports.deductLoyaltyPoints = (req, res, next) => {};
exports.customerOrderHistory = (req, res, next) => {};
