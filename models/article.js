const mongoose = require("mongoose");
const errors = require("../helpers/errors");

const articleSchema = new mongoose.Schema({
    keyword: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
        validate: {
        validator: function(v) {
            return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(v);
        },
        message: errors.LINK_TO_ORIGIN_ERR
        }
    },
    image: {
        type: String,
        required: true,
        validate: {
        validator: function(v) {
            return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(v);
        },
        message: errors.NO_IMG_URL_ERR
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
     }
});

module.exports = mongoose.model("article",articleSchema);