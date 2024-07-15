const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const { body } = require("express-validator");
const User = require("../model/user");
const { isAuth, isAdmin, isManager } = require("../helper/is-auth");

router.get("/", userController.getAllUsers);
router.post(
    "/login",
    [
        body("email")
            .not()
            .isEmpty()
            .withMessage("email_address_is_empty")
            .isEmail()
            .withMessage("invalid_email_address")
            .custom(async (value, { req }) => {
                return User.findOne({ email: value }).then((user) => {
                    if (!user) {
                        return Promise.reject("email_address_not_found");
                    }
                });
            })
            .normalizeEmail(),
        body("password")
            .not()
            .isEmpty()
            .withMessage("password_field_empty")
            .isLength({ min: 5 })
            .withMessage("password_length"),
    ],
    userController.login
);

router.post(
    "/createUser",
    isAuth,
    isAdmin || isManager,
    [
        body("name").not().isEmpty().withMessage("name_is_empty"),
        body("email")
            .not()
            .isEmpty()
            .withMessage("email_address_is_empty")
            .isEmail()
            .withMessage("invalid_email_address")
            .custom(async (value, { req }) => {
                return User.findOne({ email: value }).then((user) => {
                    if (user) {
                        return Promise.reject("email_already_exists");
                    }
                });
            })
            .normalizeEmail(),
        body("password")
            .not()
            .isEmpty()
            .isLength({ min: 5 })
            .withMessage("password_length"),
    ],
    userController.createUser
);

router.put("/edit/:id", /*isAuth || isAdmin,*/ userController.editUser);
router.put(
    "/changePassword/:id",
    /*isAuth || isAdmin,*/ userController.changePassword
);
router.put(
    "/changePermission",
    /*isAuth || isAdmin,*/ userController.changePermission
);
router.put("/changeRole", /*isAuth || isAdmin,*/ userController.changeRole);
router.delete("/deleteUser/:id", /*isAuth || isAdmin,*/ userController.deleteUser);

module.exports = router;
