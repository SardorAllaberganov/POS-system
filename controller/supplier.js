const Supplier = require("../model/supplier");
const isValidId = require("../helper/is-valid-id");
const errorMessage = require("../helper/errorMessage");
const { validationResult } = require("express-validator");

exports.getAllSuppliers = (req, res, next) => {
    Supplier.find()
        .then((suppliers) => {
            if (!suppliers) {
                errorMessage(req.t("no_suppliers_found"), 404);
            }
            return res.status(200).json({
                message: req.t("suppliers_fetched_successfully"),
                data: suppliers,
            });
        })
        .catch((error) => {
            next(error);
        });
};

exports.getSupplier = (req, res, next) => {};

exports.createSupplier = (req, res, next) => {};

exports.editSupplier = (req, res, next) => {};

exports.deleteSupplier = (req, res, next) => {};
