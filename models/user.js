var mongoose = require('mongoose'),
    answerSchema = require('./answer').answerSchema;

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    answerList: [{
        answerSchema
    }]
});

module.exports = mongoose.model("User", userSchema);
