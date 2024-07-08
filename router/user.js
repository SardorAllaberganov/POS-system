const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const { body } = require("express-validator");
const User = require("../model/user");

router.get("/", userController.getAllUsers);
router.post(
    "/login",
    [
        body("email")
            .not()
            .isEmpty()
            .withMessage("Email field is empty")
            .isEmail()
            .withMessage("Invalid email address")
            .custom(async (value, { req }) => {
                return User.findOne({ email: value }).then((user) => {
                    if (!user) {
                        return Promise.reject("Email address not found");
                    }
                });
            })
            .normalizeEmail(),
        body("password")
            .not()
            .isEmpty()
            .withMessage("Password field is empty")
            .isLength({ min: 5 })
            .withMessage("The password field contains less than 5 characters."),
    ],
    userController.login
);

module.exports = router;
