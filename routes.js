var user = require('./routes/users');
var cookieAge = 1000 * 60 * 60 * 24 * 30 * 12; // have the cookie last a year

module.exports = function(router, app, passport) {
	/**
	 * Renders the login page. Checks if the user is logged in first.
	 */
	app.get('/login', notLoggedIn, function(req, res) {
		res.render('login');
	});

	/**
	 * Renders the home page. Checks if the user is logged in first.
	 */
	app.get('/', isLoggedIn, function(req, res) {
		res.render('index', {
			currentUserId : req.user
		});
	});

	/**
	 * Tries to log in the user. Sends the user to the main page if successful.
	 * @param  {Object} req           Request object
	 * @param  {Object} res           Response object
	 * @param  {Function} next The function to get called upon success.
	 */
	app.post('/login', passport.authenticate('local', {
			failureRedirect: '/login' // redirects back to the login page if authentication fails 
		}), 
		function(req, res, next) { // authentication callback
			if (!req.body.rememberme) // check if remember me checkbox is checked
				return next(); // proceed to homepage if it isn't checked
			else {
				res.cookie('remember_me', 'logged in', { path: '/', httpOnly: true, maxAge: cookieAge });
				return next();
			}
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

	app.post('/register', user.create);

	var userRoute = router.route('/users');

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