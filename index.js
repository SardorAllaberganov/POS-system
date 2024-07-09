const express = require("express");
const app = express();
const morgan = require("morgan");
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");

const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");

i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
        fallbackLng: "en",
        backend: {
            loadPath: "./locales/{{lng}}/translation.json",
        },
    });

//environment variables
const mongo_db_url = process.env.MONGO_DB_URL;
const port = process.env.PORT;
const API = process.env.API;

//routes variables
const categoryRoutes = require("./router/category");
const userRoutes = require("./router/user");

// Headers and CORS header
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    res.setHeader("Content-Type", "application/json");
    next();
});

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(middleware.handle(i18next));

app.get("/test", (req, res) => {
    res.json({
        message: req.t("test_api_message"),
    });
});

//routes
app.use(`${API}/categories`, categoryRoutes);
app.use(`${API}/users`, userRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//db connection
mongoose
    .connect(mongo_db_url)
    .then(() => {
        console.log("Connected to DB successfully");
        app.listen(port, () => {
            console.log(`Running in port: http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });

//global error handler
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        message: req.t(error.message),
        data: req.t(error.data),
        statusCode: error.statusCode,
    });
});
