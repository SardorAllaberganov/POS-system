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
    const { firstname, lastname, email, dob, phone, address } = req.body;
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
        address,
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
    const { firstname, lastname, email, dob, phone, address } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errorMessage(req.t("validation_failed"), 422, errors);
    }

    if (isValidId(id)) {
        Customer.findById(id)
            .then((customer) => {
                if (!customer) {
                    errorMessage(req.t("customer_not_found"), 404);
                }

                customer.firstname = firstname;
                customer.lastname = lastname;
                customer.email = email;
                customer.dob = dob;
                customer.phone = phone;
                customer.address = address;

                customer
                    .save()
                    .then((result) => {
                        return res.status(200).json({
                            message: req.t("customer_updated_successfully"),
                            data: result,
                        });
                    })
                    .catch((error) => {
                        next(error);
                    });
            })
            .catch((error) => {
                next(error);
            });
    }
};
exports.deleteCustomer = (req, res, next) => {
    const id = req.params.id;
    if (isValidId(id)) {
        Customer.findByIdAndDelete(id).then((result) => {
            if (!result) {
                errorMessage(req.t("customer_not_found"), 404);
            }
            return res.status(200).json({
                message: req.t("customer_deleted_successfully"),
                data: result,
            });
        });
    } else {
        return res.status(400).json({ message: req.t("invalid_user_id") });
    }
};
exports.searchCustomer = (req, res, next) => {
    const { firstname, lastname, email, phone, city, state, country } =
        req.query;
    const query = {};
    if (firstname) query.firstname = { $regex: firstname, $options: "i" };
    if (lastname) query.lastname = { $regex: lastname, $options: "i" };
    if (email) query.email = { $regex: email, $options: "i" };
    if (phone) query.phone = { $regex: phone, $options: "i" };
    if (city) query["addresses.city"] = { $regex: city, $options: "i" };
    if (state) query["addresses.state"] = { $regex: state, $options: "i" };
    if (country)
        query["addresses.country"] = { $regex: country, $options: "i" };
    Customer.find(query)
        .then((customers) => {
            if (!customers) {
                errorMessage(req.t("customer_not_found"), 404);
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
exports.addLoyaltyPoints = (req, res, next) => {};
exports.deductLoyaltyPoints = (req, res, next) => {};
exports.customerOrderHistory = (req, res, next) => {};
