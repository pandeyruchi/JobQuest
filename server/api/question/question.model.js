'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  title: String,
  description: String,
  user: {
    id: mongoose.Schema.Types.ObjectId,
    name: String
  },
  verified: Boolean,
  created: Number,
  like: [Schema.Types.ObjectId],
  dislike: [Schema.Types.ObjectId],
  answers: [{username: String, answeredAt: Number, answer: String}],
  tag: [String]
});

module.exports = mongoose.model('Question', QuestionSchema);
