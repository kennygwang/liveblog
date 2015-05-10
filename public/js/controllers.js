var liveblog = angular.module('liveblog', ['ngRoute']);

liveblog.controller('NavController', ['$scope', '$http', '$location', function($scope, $http, $location) {
  $scope.createNewBlog = function () {
    // make API call to create new blog
    // redirect to new blog page with something like $location.path('/#/blog/:blogId')
  };

liveblog.controller('BloglistController', ['$scope', '$http', function($scope, $http) {
    $scope.bloglist = [];
    $scope.confirmDelete = {
        blogTitle: '',
        blogId: null
    };

    // Fetch the list of blogs.
    $http.get('/api/blogs')
        .success(function (data){
            if (data.message.slice(0, 2) == 'OK'){
                // Add a pretty date created field.
                data.data.map(function (blog){
                    blog.prettyDateCreated = new Date(blog.timeCreated).toLocaleDateString();
                });

                $scope.bloglist = data.data;
                console.log($scope.bloglist)
            }
        });

    // Bind the open event for the modal.
    $('.bloglist-container').on('click', '.delete-blog', function (){
        $('#confirmModal button').prop('disabled', false);

        $scope.confirmDelete.blogTitle = $(this).data('title');
        $scope.confirmDelete.blogId = $(this).data('id');
        $('#confirmModal').foundation('reveal', 'open');
    });

    // Bind the close event for the modal.
    $('.close-reveal-modal, .close-modal').click(function (){
        $('#confirmModal').foundation('reveal', 'close');
    });

    // Bind the confirm button event for the modal.
    $('.confirm-modal').click(function (){
        $('#confirmModal button').prop('disabled', true);

        // Actually delete the blog.
        $http.delete('/api/blogs/'+$scope.confirmDelete.blogId)
            .success(function (data){
                $('#confirmModal').foundation('reveal', 'close');
            })
            .error(function (data){
                alert('Unable to delete the blog!');
                $('#confirmModal').foundation('reveal', 'close');
                alert(data.data);
            });
    });
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
