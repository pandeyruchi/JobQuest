'use strict';

angular.module('jobQuestApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth) {
    $scope.listQuestions = [];
    $scope.canWrite = false;
    $scope.writeAnswer = function (question) {
      question.canWrite = true;
    };

    $scope.submitAnswer = function (question) {
      var answer = question.answer;
      if (!question.answers) {
        question.answers = [];      }
      question.canWrite = false;
      question.answers.unshift({answer:question.answer,username:Auth.getCurrentUser().name,answeredAt:Date.now()});

      question.answer = "";
      $http.put('/api/questions/' + question._id, question);
      sendMail(answer, question.user);
    };
    function sendMail(answer, user) {
      var data = ({
        contactName: Auth.getCurrentUser().name,
        contactEmail: Auth.getCurrentUser().email,
        user: user,
        contactMsg: answer
      });

      // Simple POST request example (passing data) :
      $http.post('/api/questions/send', data).
        success(function (data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          console.log(data.contactName);
        }).
        error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });

    };

    $http.get('/api/questions').success(function (list) {
      console.log(list);
      $scope.listQuestions = list;
    });

    $http.get('/api/things').success(function (awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function () {
      if ($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', {name: $scope.newThing});
      $scope.newThing = '';
    };

    $scope.upvote = function (question) {
      if (!question.like) {
        question.like = [];
      }
      var userId = Auth.getCurrentUser()._id;
      //console.log(Auth.getCurrentUser());
      var index = question.like.indexOf(userId);
      if (index === -1) {
        question.like.push(userId)
      } else {
        question.like.splice(index, 1)
      }
      $http.put('/api/questions/' + question._id, question);
    };

    $scope.downvote = function (question) {

      if (!question.dislike) {
        question.dislike = [];
      }
      var userId = Auth.getCurrentUser()._id;
      var index = question.dislike.indexOf(userId);
      if (index === -1) {
        question.dislike.push(userId)
      } else {
        question.dislike.splice(index, 1)
      }
      $http.put('/api/questions/' + question._id, question);
    };

    $scope.deleteThing = function (thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
