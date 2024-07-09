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
                    const error = new Error(req.t("category_not_found"));
                    error.statusCode = 422;
                    throw error;
                }
                return res.status(200).json({
                    message: req.t("category_fetched_successfully"),
                    data: category,
                });
            })
            .catch((error) => {
                next(error);
            });
    } else {
        return res.status(400).json({ message: req.t("invalid_category_id") });
    }
};

exports.getAllCategories = (req, res, next) => {
    Category.find()
        .then((categories) => {
            if (!categories) {
                const error = new Error(req.t("no_categories_found"));
                error.statusCode = 422;
                throw error;
            }
            const lang = req.headers["accept-language"];

            categories = categories.map((category) => {
                const { _id, image, status, createdAt, updatedAt } = category;
                const translatedName =
                    category.translations.get(lang) || category.name;

                return {
                    _id,
                    name: translatedName,
                    image,
                    status,
                    createdAt,
                    updatedAt,
                };
            });

            return res.status(200).json({
                message: req.t("categories_fetched_successfully"),
                categories: categories,
            });
        })
        .catch((error) => {
            next(error);
        });
};

exports.createCategory = (req, res, next) => {
    const { name, status, translations } = req.body;
    const image = req.file.path;

    const translationsMap = new Map(Object.entries(translations));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(req.t("validation_failed"));
        error.statusCode = 422;
        error.data = errors.array()[0].msg;
        fs.unlinkSync(req.file.path);
        throw error;
    }

    try {
        if (!req.file) {
            const error = new Error(req.t("no_image_provided"));
            error.statusCode = 422;
            throw error;
        }
        Category.findOne({ name: name })
            .then((category) => {
                if (!category) {
                    const newCategory = new Category({
                        name,
                        translations: translationsMap,
                        image,
                        status,
                    });
                    newCategory
                        .save()
                        .then((result) => {
                            return res.status(201).json({
                                message: req.t("category_created_successfull"),
                                category: newCategory,
                            });
                        })
                        .catch((error) => {
                            next(error);
                        });
                } else {
                    fs.unlinkSync(req.file.path);
                    return res.status(422).json({
                        message: req.t("category_already_exists"),
                    });
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
    const id = req.params.id;
    if (isValidId(id)) {
        Category.findById(id)
            .then((category) => {
                if (!category) {
                    const error = new Error(req.t("no_categories_found"));
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
                    const error = new Error(req.t("no_categories_found"));
                    error.statusCode = 422;
                    throw error;
                }
                category.name = name;
                category.translations = new Map(
                    Object.entries(req.body.translations)
                );
                category
                    .save()
                    .then((result) => {
                        return res.status(201).json({
                            message: req.t("category_updated_successfully"),
                            category: category,
                        });
                    })
                    .catch((error) => next(error));
            })
            .catch((error) => next(error));
    } else {
        return res.status(400).json({ message: req.t("no_categories_found") });
    }
};

exports.deleteCategory = (req, res, next) => {
    const id = req.params.id;
    let foundCategory;
    if (isValidId(id)) {
        Category.findById(id)
            .then((category) => {
                if (!category) {
                    const error = new Error(req.t("no_categories_found"));
                    error.statusCode = 422;
                    throw error;
                }
                foundCategory = category;
                return Category.deleteOne({ _id: id })
                    .then(() => {
                        if (!category.image) {
                            const error = new Error(req.t("no_image_found"));
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
                    message: `${foundCategory.name} : ${req.t(
                        "category_deleted"
                    )}`,
                });
            })
            .catch((error) => next(error));
    } else {
        return res.status(400).json({ message: req.t("invalid_category_id") });
    }
};

exports.changeStatus = (req, res, next) => {
    const id = req.params.id;
    if (isValidId(id)) {
        Category.findById(id)
            .then((category) => {
                if (!category) {
                    const error = new Error(req.t("category_not_found"));
                    error.statusCode = 422;
                    throw error;
                }
                category.status = !category.status;
                category
                    .save()
                    .then((result) => {
                        return res.status(201).json({
                            message: `${category.name} : ${req.t(
                                "category_status_changed"
                            )}`,
                            categoryStatus: category.status,
                        });
                    })
                    .catch((error) => next(error));
            })
            .catch((error) => {
                next(error);
            });
    } else {
        return res.status(400).json({ message: req.t("invalid_category_id") });
    }
};
