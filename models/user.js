var mongoose = require('mongoose'),
    answerSchema = require('./answer').answerSchema,
    passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    answerList: [{
        answerSchema
    }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
