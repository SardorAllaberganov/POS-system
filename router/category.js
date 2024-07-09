const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category");
const uploads = require("../helper/file-upload");
const { isAuth, isAdmin, isManager } = require("../helper/is-auth");
const { body } = require("express-validator");

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategory);
router.post(
    "/create",
    isAuth,
    isAdmin || isManager,
    uploads.single("image"),
    ...[body("name").trim().notEmpty().withMessage("category_name_required")],
    categoryController.createCategory
);
router.put(
    "/edit/:id",
    isAuth,
    isAdmin || isManager,
    uploads.single("image"),
    categoryController.editCategory
);
router.delete(
    "/delete/:id",
    isAuth,
    isAdmin || isManager,
    categoryController.deleteCategory
);
router.patch("/status/:id", categoryController.changeStatus);

module.exports = router;
