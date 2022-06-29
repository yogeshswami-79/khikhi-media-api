const mongoose = require('mongoose');
const userModel = require("./schemas/userSchema.json");

const userSchema = new mongoose.Schema(userModel,{ timestamps: true })

module.exports = mongoose.model("User", userSchema);