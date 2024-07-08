const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category");
const uploads = require("../helper/file-upload");
const { isAuth, isAdmin } = require("../helper/is-auth");
const { body } = require("express-validator");

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategory);
router.post(
    "/create",
    uploads.single("image"),
    ...[
        body("name").trim().notEmpty().withMessage("Category name is required"),
    ],
    categoryController.createCategory
);
router.put(
    "/edit/:id",
    uploads.single("image"),
    categoryController.editCategory
);
router.delete("/delete/:id", categoryController.deleteCategory);

module.exports = router;
