const Category = require("../model/category");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const fs = require("fs");

const isValidId = (id) => mongoose.isValidObjectId(id);

exports.getCategory = (req, res, next) => {
    const id = req.params.id;
    if (isValidId(id)) {
        Category.findById(id)
            .then((category) => {
                if (!category) {
                    const error = new Error("Category not found");
                    error.statusCode = 422;
                    throw error;
                }
                return res.status(200).json({
                    message: "Category fetched successfully",
                    data: category,
                });
            })
            .catch((error) => {
                next(error);
            });
    } else {
        return res.status(400).json({ message: "Invalid category id" });
    }
};

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

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed");
        error.statusCode = 422;
        error.data = errors.array()[0].msg;
        fs.unlinkSync(req.file.path);
        throw error;
    }

    try {
        if (!req.file) {
            const error = new Error("No image provided");
            error.statusCode = 422;
            throw error;
        }
        Category.findOne({ name: name })
            .then((category) => {
                if (!category) {
                    const newCategory = new Category({
                        name: name,
                        image: image,
                        status: status,
                    });
                    newCategory
                        .save()
                        .then((result) => {
                            return res.status(201).json({
                                message: "Category created successfully",
                                category: newCategory,
                            });
                        })
                        .catch((error) => {
                            next(error);
                        });
                } else {
                    fs.unlinkSync(req.file.path);
                    return res
                        .status(422)
                        .json({ message: "Category already exists" });
                }
            })
            .catch((error) => {
                fs.unlinkSync(req.file.path);
                next(error);
            });
    } catch (error) {
        fs.unlinkSync(req.file.path);
        next(error);
    }
};

exports.editCategory = (req, res, next) => {
    const categoryId = req.params.id;
    if (isValidId(categoryId)) {
        Category.findById(categoryId)
            .then((category) => {
                if (!category) {
                    const error = new Error("Category not found");
                    error.statusCode = 422;
                    throw error;
                }
                if (req.file) {
                    const image = req.file.path;
                    fs.unlinkSync(category.image);
                    category.image = image;
                }
                const name = req.body.name;
                if (!name || name.length === 0) {
                    const error = new Error("Name field is required");
                    error.statusCode = 422;
                    throw error;
                }
                category.name = name;
                category
                    .save()
                    .then((result) => {
                        return res.status(201).json({
                            message: "Category changed successfully",
                            category: category,
                        });
                    })
                    .catch((error) => next(error));
            })
            .catch((error) => next(error));
    } else {
        return res.status(400).json({ message: "Invalid category id" });
    }
};

exports.deleteCategory = (req, res, next) => {
    const id = req.params.id;
    let foundCategory;
    if (isValidId(id)) {
        Category.findById(id)
            .then((category) => {
                if (!category) {
                    const error = new Error("Category not found");
                    error.statusCode = 422;
                    throw error;
                }
                foundCategory = category;
                return Category.deleteOne({ _id: id })
                    .then(() => {
                        if (!category.image) {
                            const error = new Error("No image found");
                            error.statusCode = 422;
                            throw error;
                        } else {
                            fs.unlinkSync(category.image);
                        }
                    })
                    .catch((error) => next(error));
            })
            .then((result) => {
                return res.status(200).json({
                    message: `Category ${foundCategory.name} is deleted`,
                });
            })
            .catch((error) => next(error));
    } else {
        return res.status(400).json({ message: "Invalid category id" });
    }
};

exports.changeStatus = (req, res, next) => {};
