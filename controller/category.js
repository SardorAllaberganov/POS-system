const Category = require("../model/category");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const fs = require("fs");

const isValidId = (id) => mongoose.isValidObjectId(id);

exports.getAllCategories = (req, res, next) => {
    Category.find()
        .then((categories) => {
            if (!categories) {
                const error = new Error("No categories found");
                error.statusCode = 422;
                throw error;
            }
            return res.status(200).json({
                message: "Categories fetched successfully",
                data: categories,
            });
        })
        .catch((error) => {
            next(error);
        });
};

exports.createCategory = (req, res, next) => {
    const name = req.body.name;
    const image = req.file.path;
    const status = req.body.status;

    if (!name || name.length === 0) {
        const error = new Error("Name field is required");
        error.statusCode = 422;
        throw error;
    }
    if (!req.file) {
        const error = new Error("No image provided");
        error.statusCode = 422;
        throw error;
    }
    fs.unlinkSync(req.file.path);
    return res.status(201).json({
        message: "Category created successfully",
        data: {
            name: name,
            image: image,
            status: status,
        },
    });
};

exports.createCategory = (req, res, next) => {};
