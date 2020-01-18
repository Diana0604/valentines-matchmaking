var mongoose = require('mongoose'),
    answerSchema = require('./answer').answerSchema;

var userSchema = new mongoose.Schema({
    name: String, 
    email: String,
    answerList: [{
        answerSchema
    }]
});

module.exports = mongoose.model("User", userSchema);
