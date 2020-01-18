var mongoose = require('mongoose'), 
    questionSchema = require('./questions').questionSchema;

//ANSWERS:
var answerSchema = new mongoose.Schema({
    question: questionSchema,
    type: String,
    //case: text
    text: String,
    //case: multiplechoice
    choice: Number
});
var Answer = mongoose.model("Answer", answerSchema, 'answers');

module.exports = {
    answerSchema,
    Answer
}