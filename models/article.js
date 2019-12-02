const mongoose = require("mongoose");

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
        message: props => `${props.value} Invalid URL!`
        }
    },
    image: {
        type: String,
        required: true,
        validate: {
        validator: function(v) {
            return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(v);
        },
        message: props => `${props.value} Invalid URL!`
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
     }
});

module.exports = mongoose.model("article",articleSchema);