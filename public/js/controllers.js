var liveblog = angular.module('liveblog', ['ngRoute']);

liveblog.controller('NavController', ['$scope', '$http', '$location', function($scope, $http, $location) {
  $scope.createNewBlog = function () {
    // make API call to create new blog
    // redirect to new blog page with something like $location.path('/#/blog/:blogId')
  };
}]);

liveblog.controller('BloglistController', ['$scope', '$http', function($scope, $http) {

}]);

liveblog.controller('BlogController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
  /* $http.get('./data/imdb250.json').success(function(data) {
    $scope.imdbData = data;
  }); */
  $scope.postList = []; // list of posts in the blog

  $scope.createPost = function () {
    // make API call to send postData to server,
      // which sends the post to audience 
      // and responds with a post JSON object
    // add post to $scope.postList
    // ng-repeat handles the rendering
    var newPost,
        postData = {
          postType: $scope.postType,
          text: $scope.content,
          caption: $scope.caption,
          url: $scope.url
        };
  };

  $scope.deletePost = function (postId) {
    // find the post in postList array and remove it
    // ng-repeat handles the rendering
    $scope.postList = $scope.postList.filter(function(blogpost){
      return blogpost._id != postId;
    });
  };
}]);
