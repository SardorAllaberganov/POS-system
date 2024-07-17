const mongoose = require("mongoose");
const isValidId = (id) => mongoose.isValidObjectId(id);

module.exports = isValidId;
