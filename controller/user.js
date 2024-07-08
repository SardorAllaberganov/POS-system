const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const isValidId = (id) => mongoose.isValidObjectId(id);

exports.getAllUsers = (req, res, next) => {
    User.find()
        .then((users) => {
            if (!users) {
                const error = new Error("No users found");
                error.statusCode = 404;
                throw error;
            }
            return res.status(200).json({
                message: "Users fetched successfully",
                data: users,
            });
        })
        .catch((error) => {
            next(error);
        });
};

exports.login = (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed");
        error.data = errors.array();
        error.statusCode = 422;
        throw error;
    }
    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                const error = new Error("User not found");
                error.statusCode = 404;
                throw error;
            }
            bcrypt
                .compare(password, user.password)
                .then((isEqual) => {
                    if (!isEqual) {
                        const error = new Error("Wrong password");
                        error.statusCode = 401;
                        throw error;
                    }
                    const token = jwt.sign(
                        {
                            id: user._id.toString(),
                            email: user.email,
                            name: user.name,
                            role: user.role,
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: "1d",
                        }
                    );
                    return res.status(200).json({
                        message: "Login successful",
                        data: {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                        },
                        token: token,
                    });
                })
                .catch((error) => next(error));
        })
        .catch((error) => next(error));
};
