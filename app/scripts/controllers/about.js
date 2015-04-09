'use strict';

/**
 * @ngdoc function
 * @name chatApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the chatApp
 */
angular.module('chatApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
