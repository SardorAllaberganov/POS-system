const Customer = require("../model/customer");
const isValidId = require("../helper/is-valid-id");
const { validationResult } = require("express-validator");

exports.createCustomer = (req, res, next) => {};
exports.getAllCustomers = (req, res, next) => {};
exports.getCustomer = (req, res, next) => {};
exports.editCustomer = (req, res, next) => {};
exports.deleteCustomer = (req, res, next) => {};
exports.searchCustomer = (req, res, next) => {};
exports.addLoyaltyPoints = (req, res, next) => {};
exports.deductLoyaltyPoints = (req, res, next) => {};
exports.customerOrderHistory = (req, res, next) => {};
