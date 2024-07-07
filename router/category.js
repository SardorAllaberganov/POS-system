const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category");
const uploads = require("../helper/file-upload");
const { isAuth, isAdmin } = require("../helper/is-auth");
const { body } = require("express-validator");

router.get("/", categoryController.getAllCategories);
router.post(
	"/create",
	uploads.single("image"),
	categoryController.createCategory
);
router.put(
	"/edit/:id",
	uploads.single("image"),
	categoryController.editCategory
);
router.delete("/delete/:id", categoryController.deleteCategory);

module.exports = router;
