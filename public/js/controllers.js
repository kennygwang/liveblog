var liveblog = angular.module('liveblog', ['ngRoute']);

liveblog.controller('BloglistController', ['$scope', '$http', function($scope, $http) {

}]);

liveblog.controller('LoginController', ['$scope', '$http', function($scope, $http) {

}]);

liveblog.controller('BlogController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
  /* $http.get('./data/imdb250.json').success(function(data) {
    $scope.imdbData = data;
  }); */
}]);
