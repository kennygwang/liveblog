var liveblog = angular.module('liveblog', ['ngRoute'])
    , socket = io.connect()
    , isSocketBinded = false;

liveblog.controller('NavController', ['$scope', '$http', '$location', function($scope, $http, $location) {
  $scope.newBlogTitle = '';

  // Bind the open event for the modal.
  $('.top-bar-section').on('click', '#create-new-blog', function (){
      $('#createNewBlogModal').foundation('reveal', 'open');
  });

  // Bind the close event for the modal.
  $('.close-reveal-modal, .close-modal').click(function (){
      $('#createNewBlogModal').foundation('reveal', 'close');
  });

  $scope.createNewBlog = function () {
    // make API call to create new blog
    // redirect to new blog page with something like $location.path('/#/blog/:blogId')
    $http.post('/api/blogs/' + currentUserId, {title: $scope.newBlogTitle})
            .success(function(data){
                $('#createNewBlogModal').foundation('reveal', 'close');
                $location.path('/blogs/' + data.data._id);
            });
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
            }
        });

    // Fetch all existing blogs.
    $http.get('/api/blogs')
        .success(function(data) {
             if (data.message.slice(0, 2) == 'OK'){
                // Add a pretty date created field.
                data.data.map(function (blog){
                    blog.prettyDateCreated = new Date(blog.timeCreated).toLocaleDateString();
                });

                $scope.allbloglist = data.data;
            }
        });

    // Bind the open event for the modal.
    $('.bloglist-container').on('click', '.delete-blog', function (){
        $('#confirmModal button').prop('disabled', false);

        $scope.confirmDelete.blogTitle = $(this).data('title');
        $scope.confirmDelete.blogId = $(this).data('id');
        $scope.$digest();
        $('#confirmModal').foundation('reveal', 'open');
    });

    // Bind the close event for the modal.
    $('.close-reveal-modal, .close-modal').click(function (){
        $('#confirmModal').foundation('reveal', 'close');
    });

    // Bind the confirm button event for the modal.
    $scope.deleteBlog = function (){
        $('#confirmModal button').prop('disabled', true);

        // Actually delete the blog.
        $http.delete('/api/blogs/'+$scope.confirmDelete.blogId)
            .success(function (data){
                $scope.bloglist = $scope.bloglist.filter(function (blog){
                    return blog._id !== $scope.confirmDelete.blogId;
                });
                $('#confirmModal').foundation('reveal', 'close');
            })
            .error(function (data){
                alert('Unable to delete the blog!');
                $('#confirmModal').foundation('reveal', 'close');
                alert(data.data);
            });
    };
}]);

liveblog.controller('BlogController', ['$scope', '$http', '$routeParams', '$sce', function($scope, $http, $routeParams, $sce) {
  $scope.blog = $scope.blog || {};
  $scope.currentUserId = currentUserId;

  var blogId = $routeParams.blogId;
  $scope.blogId = blogId;

  // Fetch all posts onload.
  $http.get('/api/blog/'+blogId)
        .success(function (res){
            var blog = res.data;

            // Add pretty time.
            blog.posts.map(function (post){
                post.prettyTimeCreated = (new Date(post.timeCreated)).toLocaleTimeString();
            });
            blog.posts = blog.posts.sort(function (a, b){
                return (new Date(b.timeCreated)) - (new Date(a.timeCreated));
            });

            $scope.blog = blog;
        });


    socket.on('ping', function (){
        console.log('ping')
    })

  socket.emit('watch', {blogId: blogId});
  //console.log('connected to blog ' + blogId);
  socket.on('send post', function(data) {
    // Add pretty time.
    data.post.prettyTimeCreated = (new Date(data.post.timeCreated)).toLocaleTimeString();
    $scope.blog.posts.unshift(data.post);
    $scope.blog.posts = $scope.blog.posts.sort(function (a, b){
                return (new Date(b.timeCreated)) - (new Date(a.timeCreated));
            });
    $scope.$digest();
  });

  socket.on('delete post', function (data){
    // Remove the post from the page and close the modal.
    $scope.blog.posts = $scope.blog.posts.filter(function(blogpost){
        return blogpost._id != data.postId;
    });
    $scope.$digest();
  });


  isSocketBinded = true;
  console.log('Listening over socket channel: '+blogId);

  $(document).ready(function(){
    $('#share-link').click(function(){
      $(this).select();
    });
  });

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
      socket.emit('new post', {
        blogId: blogId,
        post: data.data
      });
      console.log('Emitting new post created signal.');

      // Clear input fields
      $('.clear-after').val('');
      $scope.content = '';
      $scope.caption = '';
      $scope.url = '';
    });
  };

  $scope.updateTitle = function () {
    // make the API call to change the blog title to whatever $scope.title is
    // update the DOM title field on success
    $http.put('/api/blogs/'+blogId, {title: $scope.blog.title})
            .success(function (e){
                console.log(e)
                $('#editBlogTitleModal').foundation('reveal', 'close');
            });
    
  };

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src.replace('watch?v=', 'embed/'));
  }

  $scope.storePost = function(postId) {
    $scope.postToDelete = postId;
    $('#deletePostModal').foundation('reveal', 'open');
  };

  $scope.deletePost = function () {
    var postId = $scope.postToDelete;
    $http.delete('/api/posts/'+blogId+'/'+postId)
            .success(function (res){
                socket.emit('delete post', {
                    blogId: blogId,
                    postId: postId
                });

                $('#deletePostModal').foundation('reveal', 'close');
            })
            .error(function (res) {
                console.log(res)
            });
  }

  // Bind the open event for the modal.
  $('form').on('click', '#blog-title', function (){ 
    $('#editBlogTitleModal').foundation('reveal', 'open');
  });

  // Bind the open event for the modal.
  $('.post').on('click', '.delete-post', function () {
    $('#deletePostModal').foundation('reveal', 'open');
  });

  // Bind the close event for the modal.
  $('.close-reveal-modal, .close-modal').click(function (){
    $('#editBlogTitleModal').foundation('reveal', 'close');
    $('#deletePostModal').foundation('reveal', 'close');
  });
}]);
