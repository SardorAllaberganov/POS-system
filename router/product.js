const Product = require("../model/product");
const { body } = require("express-validator");
const express = require("express");
const router = express.Router();
const productController = require("../controller/product");

router.get("/products", productController.getAllProducts);

module.exports = router;
