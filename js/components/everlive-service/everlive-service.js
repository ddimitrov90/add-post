(function() {
    var blogAppServices = angular.module('blogApp.services', []);
    blogAppServices.service('EverliveService', function($q) {
        var self = this;
        var el = new Everlive('fW5fEkhhplSXgaCS');
        var blogPostData = el.data('BlogPost');
        var tagsData = el.data('Tags');

        this.getBlogPosts = function getBlogPosts(count) {
            if (!count) {
                count = 5;
            }
            var query = new Everlive.Query();
            query.orderDesc('Date').take(count);

            var deferred = $q.defer();
            blogPostData.get(query).then(function(data) { 
                    deferred.resolve(data.result);
                },
                function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        this.getBlogPostByUrl = function getBlogPostByUrl(url) {
            var deferred = $q.defer();
            blogPostData.get({
                Url: url
            }).then(function(data) { 
                    deferred.resolve(data.result[0]);
                },
                function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        this.addNewBlogPost = function addNewBlogPost(blogPost) {
            var deferred = $q.defer();
            blogPostData.create(blogPost).then(function(data) { 
                    deferred.resolve(data);
                },
                function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        this.getBlogPostByTag = function getBlogPostByTag(tag) {
            var query = new Everlive.Query();
            query.where({Tags: tag}).orderDesc('Date');

            var deferred = $q.defer();
            blogPostData.get(query).then(function(data) { 
                    deferred.resolve(data.result);
                },
                function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        this.getBlogPostsArchive = function getBlogPostsArchive() {

            var query = new Everlive.Query();
            query.orderDesc('Date').select('Title', 'Url', 'Archive');

            var deferred = $q.defer();
            blogPostData.get(query).then(function(data) { 
                    var archivedData = self._buildArchiveData(data.result);
                    deferred.resolve(archivedData);
                },
                function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        this.getBlogPostsByMonth = function getBlogPostsByMonth(month) {
            var query = new Everlive.Query();
            query.where().regex('Archive', month, 'i');

            var deferred = $q.defer();
            blogPostData.get(query).then(function(data) { 
                    deferred.resolve(data.result);
                },
                function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        this._buildArchiveData = function _buildArchiveData(everliveData) {
            var result = {};
            for (var i = 0; i < everliveData.length; i++) {
                var currentBlogPost = everliveData[i];
                if (!result[currentBlogPost.Archive]) {
                    result[currentBlogPost.Archive] = [];
                }
                result[currentBlogPost.Archive].push(currentBlogPost);
            };
            return result;
        };

        this.getTags = function getTags() {
            var query = new Everlive.Query();
            query.orderDesc('Counter');

            var deferred = $q.defer();
            tagsData.get().then(function(data) { 
                    var tags = self._buildTagsCss(data.result);
                    deferred.resolve(tags);
                },
                function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        this._buildTagsCss = function _buildTagsCss(everliveData) {
            var result = [];
            for (var i = 0; i < everliveData.length; i++) {
                var tag = everliveData[i];
                if (tag.Counter < 10) {
                    result.push({
                        Name: tag.Name,
                        CssClass: 'tag1'
                    });
                } else {
                    var size = Math.round(tag.Counter / 10);
                    result.push({
                        Name: tag.Name,
                        CssClass: 'tag' + size
                    })
                }
            };
            return result;

        };
    });
})();