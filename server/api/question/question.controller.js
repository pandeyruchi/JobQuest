'use strict';

var _ = require('lodash');
var Question = require('./question.model');
var nodemailer = require('nodemailer');
//var transporter = nodemailer.createTransport();
var smtpTransport = require('nodemailer-smtp-transport');
var User = require('../user/user.model');


var transporter = nodemailer.createTransport(
  smtpTransport('smtps://response.jobquest:synerzip@smtp.gmail.com')
);


/*var transporter = nodemailer.createTransport("SMTP", {
 service: "Gmail",
 auth: {
 user: "pandeyruchi.30@gmail.com",
 pass: "chivalarous21"
 }
 });*/

// Get list of questions
exports.index = function (req, res) {
  Question.find(function (err, questions) {
    if (err) {
      return handleError(res, err);
    }

    return res.json(200, _.sortByOrder(questions, ['created'], ['desc']));
  });
};

// Get a single question
exports.show = function (req, res) {
  Question.findById(req.params.id, function (err, question) {
    if (err) {
      return handleError(res, err);
    }
    if (!question) {
      return res.send(404);
    }
    return res.json(question);
  });
};

// Creates a new question in the DB.
exports.create = function (req, res) {
  var question = req.body;
  question.user = {id: req.user._id, name: req.user.name};
  question.created = Date.now();
  Question.create(req.body, function (err, question) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, question);
  });
};

exports.sendMail = function (req, res) {
  var data = req.body;
  User.findById(data.user, function (err, user) {
    if (!err && !!user) {
      transporter.sendMail({
        from: 'jobquest@gmail.com',
        to: user.email,
        subject: 'Job-Quest : your question answered from ' + data.contactName,
        text: data.contactMsg
      }, function (error, response) {
        if (error) {
          console.log(error);
        } else {
        }
      });
    }
  });
  res.json(data);
};


// Updates an existing question in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Question.findById(req.params.id, function (err, question) {
    if (err) {
      return handleError(res, err);
    }
    if (!question) {
      return res.send(404);
    }
    var updated = _.merge(question, req.body);
    console.log("updated" + updated + question);
    updated.markModified('answers');
    updated.markModified('like');
    updated.markModified('dislike');

    updated.save(function (err, obj) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, obj);
    });
  });
};

// Deletes a question from the DB.
exports.destroy = function (req, res) {
  Question.findById(req.params.id, function (err, question) {
    if (err) {
      return handleError(res, err);
    }
    if (!question) {
      return res.send(404);
    }
    question.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
