const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const isValidId = require("../helper/is-valid-id");
const errorMessage = require("../helper/errorMessage");

exports.getAllUsers = (req, res, next) => {
	User.find()
		.then((users) => {
			if (!users) {
				errorMessage(req.t("no_user_found"), 404);
			}
			users = users.map((user) => {
				const userWithoutPassword = user.toObject();
				delete userWithoutPassword.password;
				return userWithoutPassword;
			});
			return res.status(200).json({
				message: req.t("user_fetched_successfully"),
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
		errorMessage(req.t("validation_failed"), 422, errors);
	}
	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				errorMessage(req.t("no_user_found"), 404);
			}
			bcrypt
				.compare(password, user.password)
				.then((isEqual) => {
					if (!isEqual) {
						errorMessage(req.t("wrong_password"), 401);
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
						message: req.t("login_successful"),
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
		errorMessage(req.t("validation_failed"), 422, errors);
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
						message: req.t("user_created_successfully"),
						data: userWithoutPassword,
					});
				})
				.catch((error) => {
					next(error);
				});
		})
		.catch((error) => next(error));
};

exports.editUser = (req, res, next) => {
	const id = req.params.id;
	if (isValidId(id)) {
		User.findById(id)
			.then((user) => {
				if (!user) {
					errorMessage(req.t("no_user_found"), 404);
				}
				const { name, email, phoneNumber } = req.body;
				user.name = name;
				user.email = email;
				user.phoneNumber = phoneNumber;
				user.save()
					.then((result) => {
						const userWithoutPassword = result.toObject();
						delete userWithoutPassword.password;
						return res.status(201).json({
							message: req.t("user_updated_successfully"),
							data: userWithoutPassword,
						});
					})
					.catch((error) => next(error));
			})
			.catch((error) => next(error));
	} else {
		return res.status(400).json({ message: req.t("invalid_user_id") });
	}
};

exports.changePassword = (req, res, next) => {
	const id = req.params.id;
	const { password, newPassword, confirmNewPassword } = req.body;

	if (isValidId(id)) {
		User.findById(id)
			.then((user) => {
				if (!user) {
					errorMessage(req.t("no_user_found", 404));
				}
				console.log(password, newPassword, confirmNewPassword);
				bcrypt
					.compare(password, user.password)
					.then((isEqual) => {
						if (!isEqual) {
							errorMessage(req.t("wrong_password"), 401);
						}
						if (newPassword === confirmNewPassword) {
							bcrypt
								.hash(newPassword, 12)
								.then((hashedNewPassword) => {
									user.password = hashedNewPassword;
									return user
										.save()
										.then((result) => {
											return res.status(201).json({
												message: req.t(
													"password_changed_successfully"
												),
											});
										})
										.catch((error) => {
											next(error);
										});
								})
								.catch((error) => next(error));
						} else {
							errorMessage(req.t("not_equal_password"), 401);
						}
					})
					.catch((error) => next(error));
			})
			.catch((error) => {
				next(error);
			});
	} else {
		return res.status(400).json({ message: req.t("invalid_user_id") });
	}
};

exports.changePermission = (req, res, next) => {
	const id = req.body.id;
	const { canView, canUpdate, canDelete, canCreate } = req.body.permissions;
	if (isValidId(id)) {
		User.findById(id)
			.then((user) => {
				if (!user) {
					errorMessage(req.t("no_user_found"), 404);
				}

				user.permissions.view = canView;
				user.permissions.update = canUpdate;
				user.permissions.delete = canDelete;
				user.permissions.create = canCreate;

				user.save()
					.then((result) => {
						return res.status(201).json({
							message: req.t("permission_changed_successfully"),
						});
					})
					.catch((error) => next(error));
			})
			.catch((error) => {
				next(error);
			});
	} else {
		return res.status(400).json({ message: req.t("invalid_user_id") });
	}
};

exports.changeRole = (req, res, next) => {
	const { id, role } = req.body;
	if (isValidId(id)) {
		User.findById(id)
			.then((user) => {
				if (!user) {
					errorMessage(req.t("no_user_found"), 404);
				}
				user.role = role;
				user.save()
					.then((result) => {
						return res.status(201).json({
							message: req.t("role_changed_successfully"),
						});
					})
					.catch((error) => next(error));
			})
			.catch((error) => {
				next(error);
			});
	} else {
		return res.status(400).json({ message: req.t("invalid_user_id") });
	}
};

exports.deleteUser = (req, res, next) => {
	const id = req.params.id;
	if (isValidId(id)) {
		User.findById(id)
			.then((user) => {
				if (!user) {
					errorMessage(req.t("no_user_found"), 404);
				}
				User.findByIdAndDelete(id)
					.then((result) => {
						return res.status(200).json({
							message: req.t("user_deleted_successfully"),
						});
					})
					.catch((error) => next(error));
			})
			.catch((error) => next(error));
	} else {
		return res.status(400).json({ message: req.t("invalid_user_id") });
	}
};
