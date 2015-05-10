var liveblog = angular.module('liveblog', ['ngRoute'])
    , socket = io.connect('http://localhost:3000')
    , isSocketBinded = false;

liveblog.controller('NavController', ['$scope', '$http', '$location', function($scope, $http, $location) {
  $scope.createNewBlog = function () {
    // make API call to create new blog
    // redirect to new blog page with something like $location.path('/#/blog/:blogId')
    $http.post('/api/blogs/' + currentUserId).success(function(data){
      $location.path('/#/blogs/' + data.data._id);
    })
  };
}]);

liveblog.controller('BloglistController', ['$scope', '$http', function($scope, $http) {
    $scope.bloglist = [];
    $scope.confirmDelete = {
        blogTitle: '',
        blogId: null
    };

    // Fetch the list of blogs.
    $http.get('/api/blogs/'+currentUserId)
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
  $scope.blog = $scope.blog || {};

  var blogId = $routeParams.blogId;
  $scope.blogId = blogId;

  // Fetch all posts onload.
  $http.get('/api/blog/'+blogId)
        .success(function (res){
            var blog = res.data;
            blog.posts.map(function (post){
                post.prettyTimeCreated = (new Date(post.timeCreated)).toLocaleTimeString();
            });
            blog.posts = blog.posts.sort(function (a, b){
                return (new Date(b.timeCreated)) - (new Date(a.timeCreated));
            });

            $scope.blog = res.data;
        });

  socket.on(blogId, function(data){
    console.log('Got message!', data);

    $scope.blog.posts.unshift(data.post).sort(function (a, b){
                return (new Date(a.timeCreated)) - (new Date(b.timeCreated));
            });
    $scope.$digest();
  });
  isSocketBinded = true;
  console.log('Listening over socket channel: '+blogId);

  $scope.createPost = function () {
    // make API call to send postData to server,
      // which sends the post to audience 
      // and responds with a post JSON object
    // add post to $scope.blog.posts
    // ng-repeat handles the rendering
    var postData = {
          postType: $scope.postType,
          text: $scope.content,
          caption: $scope.caption,
          url: $scope.url
        };

    $http.post('/api/posts/' + blogId, postData).success(function(data){
      socket.emit('new post created', {
        blogId: blogId,
        post: data.data
      });
      console.log('Emitting new post created signal.')
    });
  };

  $scope.deletePost = function (postId) {
    // find the post in blog.posts array and remove it
    // ng-repeat handles the rendering
    $http.delete('/api/posts/' + postId).success(function(){
      $scope.blog.posts = $scope.blog.posts.filter(function(blogpost){
        return blogpost._id != postId;
      });
    });
  };
}]);
