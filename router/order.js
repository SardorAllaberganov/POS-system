const express = require("express");
const router = express.Router();
const orderController = require("../controller/order");

router.get("/", orderController.getAllOrders);
router.post("/create", orderController.createOrder);

module.exports = router;
