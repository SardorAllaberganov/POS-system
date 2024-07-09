const { expressjwt: jwt } = require("express-jwt");
const secret = process.env.JWT_SECRET;

const isAuth = jwt({
    secret,
    algorithms: ["HS256"],
});

const isAdmin = (req, res, next) => {
    if (req.auth.role !== "admin") {
        return res.status(403).json({ message: req.t("access_denied") });
    }
    next();
};

const isCashier = (req, res, next) => {
    if (req.auth.role !== "cashier") {
        return res.status(403).json({ message: req.t("access_denied") });
    }
    next();
};

const isManager = (req, res, next) => {
    if (req.auth.role !== "manager") {
        return res.status(403).json({ message: req.t("access_denied") });
    }
    next();
};

module.exports = {
    isAuth,
    isAdmin,
    isCashier,
    isManager,
};
