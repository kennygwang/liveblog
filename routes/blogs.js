var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , Blog = mongoose.model('Blog')
  , Post = mongoose.model('Post');

/**
 * Creates a blog, inserts the blog MongoDB ID into the logged in user's object, and sends the newly constructed
 * blog object in the response.
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
exports.createBlog = function(req, res) {
	if (!req.body.title) {
		return res.status(400).json({ message: "Title field is empty.", data: {} });
	}

	var id = mongoose.Types.ObjectId(req.params.id);
	User.findById(id, function(err, user) {
		if (err) {
			res.status(500).json({ message: "Server error.", data: err });
		} else if (!user) {
			res.status(404).json({ message: "User not found.", data: {} });
		} else {
			var name = user.pub.firstName + " " + user.pub.lastName;
			var blog = new Blog({
				authorId: id,
				authorName: name,
				title: req.body.title
			});
			// store the blog and update the user object with the blog ID
			blog.save(function(err) {
				user.pub.blogs.push(blog._id);
				user.save(function(err) {
					if (err) { 
						res.status(500).json({ message: "Server error.", data: err });
					} else {
						res.status(201).json({ message: "Blog created.", data: blog });
					}
				})
			});
		}
	});
};

/**
 * Sends the blog given by the blog ID endpoint.
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
exports.listBlog = function(req, res) {
	var id = mongoose.Types.ObjectId(req.params.blogId);
	Blog.findById(id, function(err, blog) {
		if (err) {
			res.status(500).json({ message: "Server error.", data: err });
		} else {
			res.status(200).json({ message: "OK.", data: blog })
		}
	});
};

/**
 * Sends all blogs through the response
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
exports.listBlogs = function(req, res) {
	Blog.find(function(err, blogs) {
		if (err) {
			return res.status(500).json({ message: "Server error.", data: err });
		}

		res.status(200).json({ message: "OK.", data: blogs });
	});
};

/**
 * Sends all blogs owned by the user by the ID endpoint through the response
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
exports.listBlogsById = function(req, res) {
	var id = mongoose.Types.ObjectId(req.params.id);
	Blog.find({ authorId: id }, function(err, blogs) {
		if (err) {
			return res.status(500).json({ message: "Server error.", data: err });
		}

		res.status(200).json({ message: "OK.", data: blogs });
	});
};

/**
 * Update the blog given by the blog ID endpoint.
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
exports.updateBlogTitle = function(req, res) {
	var id = mongoose.Types.ObjectId(req.params.id);
	var newTitle = req.body.title;

	Blog.update({_id: req.params.id}, {$set: {'title': newTitle}}, function(err, blog) {
		if (err) {
			res.status(500).json({ message: "Server error.", data: err });
		} else {
			res.status(200).json({ message: "OK.", data: blog })
		}
	});
};

/**
 * Deletes the blog specified by the blog ID endpoint, and removes the blog ID from the author user.
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
exports.deleteBlog = function(req, res) {
	console.log(req.params, Blog, Blog.findAndModify)
	var id = mongoose.Types.ObjectId(req.params.id);
	Blog.remove({ _id: id }, function(err, blog) {
		if (err) {
			return res.status(500).json({ message: 'Server error.', data: err });
		}

		if (blog) {
			// delete all blogs owned by the deleted user
			User.update({ _id: blog.authorId }, { $pull: { blogs: blog._id } }, function(err, blogs) {
				if (err) {
					res.status(500).json({ message: 'Server error.', data: err });
				} else {
					res.status(200).json({ message: 'Blog successfully deleted.', data: {} });
				}
			});
		} else {
			res.status(404).json({ message: 'Blog not found.', data: {} });
		}
	});
};


/**
 * Creates a new post object and adds it to the blog object that's given by the blog ID endpoint.
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
exports.createPost = function(req, res) {
	var blogId = mongoose.Types.ObjectId(req.params.id);
	var post = new Post(req.body);

	Blog.findById(blogId, function(err, blog) {
		if (err) {
			res.status(500).json({ message: "Server error.", data: err });
		} else if (!blog) {
			res.status(404).json({ message: "Blog not found.", data: err });
		} else {
			blog.posts.push(post); // update the blog object with the new post
			blog.lastUpdated = Date.now();
			blog.save(function(err) {
				if (err) {
					res.status(500).json({ message: "Server error.", data: err });
				} else {
					res.status(201).json({ message: "Post created.", data: post });
				}
			})
		}
	});
};

/**
 * Lists all the posts owned by the blog with the given endpoint ID.
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
exports.listPosts = function(req, res) {
	var blogId = mongoose.Types.ObjectId(req.params.id);

	Blog.findById(blogId, function(err, blog) {
		if (err) {
			res.status(500).json({ message: "Server error.", data: err });
		} else if (!blog) {
			res.status(404).json({ message: "Blog not found.", data: {} });
		} else {
			res.status(200).json({ message: "OK.", data: blog.posts });
		}
	});
};

exports.updatePost = function(req, res) {

};

/**
 * Deletes the post specified by the post ID endpoint from the blog specified by the blog ID endpoint.
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
exports.deletePost = function(req, res) {
	var postId = mongoose.Types.ObjectId(req.params.postId);
	var blogId = mongoose.Types.ObjectId(req.params.blogId);

	Blog.findById(blogId, function(err, blog) {
		if (err) {
			res.status(500).json({ message: "Server error.", data: err });
		} else if (!blog) {
			res.status(404).json({ message: "Blog not found.", data: {} });
		} else {
			for (var i = 0; i < blog.posts.length; i++) { // find the index of the post and splice it
				if (blog.posts[i]._id === postId) { 
					blog.posts.splice(i);
					blog.lastUpdated = Date.now();
					blog.save(function(err) {
						if (err) {
							res.status(500).json({ message: "Server error.", data: err });
						} else {
							res.status(200).json({ message: "Post successfully deleted", data: {} });
						}
					});

					return;
				}
			}
			// otherwise it means the post wasn't found
			res.status(404).json({ message: "Post not found.", data: {} });
		}
	});
};
