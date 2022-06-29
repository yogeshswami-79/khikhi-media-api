const mongoose = require('mongoose');
const postModel = require("./schemas/postSchema.json");

const postSchema = new mongoose.Schema(postModel,{ timestamps: true })

module.exports = mongoose.model("Post", postSchema);