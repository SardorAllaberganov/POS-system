const express = require("express");
const app = express();
const morgan = require("morgan");
require("dotenv").config();
const mongoose = require("mongoose");

const mongo_db_url = process.env.MONGO_DB_URL;
const port = process.env.PORT;

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

app.use(morgan("dev"));
app.use(express.json());

app.get("/test", (req, res) => {
    res.json({
        message: "Welcome to the API",
    });
});

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

//central error handler
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        message: error.message,
        data: error.data,
        statusCode: error.statusCode,
    });
});
