/**
 * Created by ruchyp on 12/22/2015.
 */
angular.module('jobQuestApp')
  .controller('QuestionCtrl', function ($scope, $state, $http) {
    $scope.designations = [{"title": "Select Designation"},
      {"title": "Jr. Software Developer"},
      {"title": "Software Developer"},
      {"title": "Sr. Software Developer"},
      {"title": "Team Lead"},
      {"title": "Software Architect"},
      {"title": "Manager"}
    ];

    $scope.user={};

    $scope.designation = $scope.designations[0];

    $scope.post = function (user) {
      var usr = {};
      usr.title = "Hi, I am working with " + user.company + " as a" + user.designation.title + ". My current ctc is " + user.ctc + ". Currently I have one offer in hand as "+user.offered.designation.title+ " from " + user.offered.company + " offering "+ user.offered.ctc + " as package.";
      usr.description = user.question;

      var res = $http.post('/api/questions', usr);
      res.success(function (data) {
        console.log(data);
        if (!!data.error) {
            console.log(data.error);
        }
        else {
          $state.go("main");
        }
      });
    }
  });
