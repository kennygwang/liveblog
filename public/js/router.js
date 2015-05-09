liveblog.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: './partials/list.html',
    controller: 'imdbController'
  })
  .when('/gallery', {
    templateUrl: './partials/gallery.html',
    controller: 'imdbController'
  })
  .when('/movie/:movie_rank', {
    templateUrl: './partials/details.html',
    controller: 'movieController'
  })
});
