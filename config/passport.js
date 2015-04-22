// load passport strategies
var LocalStrategy = require('passport-local').Strategy
  , RememberMeStrategy = require('passport-remember-me').Strategy;
// load all necessary models
var User = require('../models/user');

module.exports = function(passport) {
	// serializes user for login
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// deserializes user for logout
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	// local login strategy using passport
	passport.use(new LocalStrategy({
			// override username field with email
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true // pass the entire request to callback
		},
		function(req, username, password, done) {
			User.getAuthenticated(username, password, function(err, user, reason) {
				// if there's an error, then return the error
				if (err)
					return done(err);

				if (user) { // the user successfully logs in
					return done(null, user);
				}
				else { // otherwise determine why the login failed
					var reasons = User.failedLogin;
					switch(reasons) {
						case reasons.MAX_ATTEMPTS:
							console.log("too many tries");
							// send email or notify the user that the account is temporarily locked
							return done(null, false, { error: "Too many failed login attempts. Please wait a few minutes before you try again." });
							break;
					}
					return done(null, false, { error: "The username or password is incorrect" });
				}
			});
		}
	));
};