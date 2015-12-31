/**
 * Created by ruchyp on 12/22/2015.
 */
'use strict';

angular.module('jobQuestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('question', {
        url: '/question',
        templateUrl: 'app/question/question.html',
        controller: 'QuestionCtrl'
      });
  });
