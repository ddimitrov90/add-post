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
    $scope.operationMsg = '';
    $scope.showOpMsg = false;
    $scope.newPost = {};
    $scope.submitPost = function() {

        EverliveService.login($scope.username, $scope.password).then(
            function() {
                if($scope.tags){
                    var tags = $scope.tags.split(',');
                    $scope.newPost.Tags = tags;
                }
                $scope.newPost.Date = new Date();
                EverliveService.addNewBlogPost($scope.newPost).then(
                    function() {
                        EverliveService.updateTagsCounter($scope.newPost.Tags).then(
                            function() {
                                $scope.operationMsg = 'Success!';
                                $scope.showOpMsg = true;
                            },
                            $scope.showErrorMsg // error inc tags
                        );
                    },
                    $scope.showErrorMsg// error adding new blog post
                );
            },
            $scope.showErrorMsg // error login
        );
    };

    $scope.showErrorMsg = function(err){
        $scope.operationMsg = err.message;
        $scope.showOpMsg = true;
    };

    $scope.savePost = function() {
        localStorage.setItem($scope.savePostId, JSON.stringify($scope.newPost));
    };

    $scope.loadPost = function() {
        var savedPost = JSON.parse(localStorage.getItem($scope.savePostId));
        $scope.newPost = savedPost;
    };
});