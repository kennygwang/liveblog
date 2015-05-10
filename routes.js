var users = require('./routes/users')
  , blogs = require('./routes/blogs')
  , cookieAge = 1000 * 60 * 60 * 24 * 30 * 12; // have the cookie last a year

module.exports = function(router, app, passport) {
	/**
	 * Renders the login page. Checks if the user is logged in first.
	 */
	app.get('/login', notLoggedIn, function(req, res) {
		res.render('login', {
			
		});
	});

	/**
	 * Renders the home page. Checks if the user is logged in first.
	 */
	app.get('/', isLoggedIn, function(req, res) {
		console.log("index")
		res.render('index', {
			currentUserId : req.user._id
		});
	});

	/**
	 * Tries to log in the user. Sends the user to the main page if successful.
	 * @param  {Object} req           Request object
	 * @param  {Object} res           Response object
	 * @param  {Function} next The function to get called upon success.
	 */
	app.post('/login', 
		passport.authenticate('local', {
			failureRedirect: '/login' // redirects back to the login page if authentication fails 
		}), 
		function(req, res, next) { // authentication callback
			if (!req.body.rememberme) // check if remember me checkbox is checked
				return next(); // proceed to homepage if it isn't checked

			var tokenString = stringGenerator.randomString(64); // generate a new random token
			var token = new Token({ // create the token and assign the user's id to it
				token: tokenString,
				uid: req.user._id
			});
			// save the token and create a new cookie for the user.
			token.save(function(err) {
				if (err)
					return next(err);

				res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: cookieAge });
				return next();
			});
		},
		function(req, res) {
			res.redirect('/'); // redirect to the home page after 
		}
	);

	/**
	 * Logs out the user and clears the user cookie.
	 * @param  {Object} req      Request object
	 * @param  {Object} res 	 Response object
	 */
	app.get('/logout', function(req, res) {
		if (req.user) // check if the user is logged in
			Token.find({ uid: req.user._id }, function (err, tokens) {
				for (var i = 0; i < tokens.length; i++)
					tokens[i].remove();
			}); // remove the remember me token from the db

		res.clearCookie('remember_me'); // delete the cookie
		req.logout();
		res.redirect('/login'); // redirect back to the login page
	});

	/**
	 * Renders the register page.
	 */
	app.get('/register', function (req, res){
		res.render('register');
	});

	/**
	 * All router routes begin with "/api". I.e. "/api/users/:id"
	 */
	// this route has GET
	var userRoute = router.route('/users');
	userRoute.get(users.list)
	.post(users.create);

	// this route has DELETE
	var userEndpointRoute = router.route('/users/:id');
	userEndpointRoute.delete(users.delete);

	// this route has GET
	var blogRoute = router.route('/blogs');
	blogRoute.get(blogs.listBlogs);

	// this route has GET, POST, DELETE
	var blogEndpointRoute = router.route('/blogs/:id');
	blogEndpointRoute.get(blogs.listBlogsById)
	.post(blogs.createBlog)
	.delete(blogs.deleteBlog);

	// this route has GET, POST
	var postRoute = router.route('/posts/:id');
	postRoute.get(blogs.listPosts)
	.post(blogs.createPost);

	// this route has DELETE
	var postEndpointRoute = router.route('/posts/:blogId/:postId');
	postEndpointRoute.delete(blogs.deletePost);
};

/**
 * Checks if the user is logged in, otherwise it redirects them to the landing page.
 * @param  {Object}   req  Request object
 * @param  {Object}   res  Response object
 * @param  {Function} next The function to be called if the user is authenticated
 */
function isLoggedIn(req, res, next) {
	// check if user is authenticated in session
	if (req.isAuthenticated())
		return next();
	// redirect back to landing page if user isn't authenticated
	res.redirect('/login');
}

/**
 * Redirects the user to the main page if they are already logged in.
 * @param  {Object}   req  Request object
 * @param  {Object}   res  Response object
 * @param  {Function} next The function to be called if the user isn't authenticated
 */
function notLoggedIn(req, res, next) {
	// check if user isn't authenticated in session
	if (!req.isAuthenticated())
		return next();
	// redirect to the home page if the user is authenticated
	res.redirect('/');
}