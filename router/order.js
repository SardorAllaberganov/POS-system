const express = require("express");
const router = express.Router();
const orderController = require("../controller/order");

router.get("/", orderController.getAllOrders);

module.exports = router;
