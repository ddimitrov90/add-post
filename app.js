'use strict';

var app = angular.module('blogApp', [
    'ngRoute',
    'textAngular',
    'blogApp.services'
]).
config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {

    }
]);

app.controller('MainCtrl', function($scope, EverliveService) {
    $scope.newPost = {};
    $scope.submitPost = function() {
        var tags = $scope.tags.split(',');
        $scope.newPost.Tags = tags;
        $scope.newPost.Date = new Date();
        EverliveService.addNewBlogPost($scope.newPost).then(
	        function(result) { 
	              console.log(result);
	        },
        	function() {
      		}
      	);
    };

    $scope.savePost = function(){
    	localStorage.setItem($scope.savePostId, JSON.stringify($scope.newPost));
    };

    $scope.loadPost = function(){
    	var savedPost = JSON.parse(localStorage.getItem($scope.savePostId));
    	$scope.newPost = savedPost;
    };
});