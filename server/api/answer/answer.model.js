'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AnswerSchema = new Schema({
  text: String,
  user: mongoose.Schema.Types.ObjectId,
  verified: Boolean,
  answered:Number,
  vote:Number
});

module.exports = mongoose.model('Answer', AnswerSchema);
