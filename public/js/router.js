liveblog.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: './partials/_bloglist.html',
    controller: 'BloglistController'
  })
  .when('/users/:id', {
    templateUrl: './partials/_bloglist.html',
    controller: 'BloglistController'
  })
  .when('/blogs/:blogId', {
    templateUrl: './partials/_blog.html',
    controller: 'BlogController'
  })
  .when('/blog_test', {
    templateUrl: './partials/_blog.html',
    controller: 'BlogController'
  })
});