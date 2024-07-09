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

exports.createUser = (req, res, next) => {
    const { name, email, password, role, permissions, phoneNumber } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed");
        error.data = errors.array();
        error.statusCode = 422;
        throw error;
    }
    const { canView, canUpdate, canDelete, canCreate } = permissions;
    bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword,
                role: role,
                permissions: {
                    view: canView,
                    update: canUpdate,
                    delete: canDelete,
                    create: canCreate,
                },
                phoneNumber: phoneNumber,
            });
            return user
                .save()
                .then((result) => {
                    const userWithoutPassword = result.toObject();
                    delete userWithoutPassword.password;
                    return res.status(201).json({
                        message: "User created successfully",
                        data: userWithoutPassword,
                    });
                })
                .catch((error) => {
                    next(error);
                });
        })
        .catch((error) => next(error));
};
