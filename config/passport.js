// load passport strategies
var LocalStrategy = require('passport-local').Strategy
  , RememberMeStrategy = require('passport-remember-me').Strategy;
// load all necessary models
var User = require('../models/user');

var bcrypt = require('bcrypt');

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
	passport.use(new LocalStrategy(
		function(email, password, done) {
			console.log("goodbye")
			User.findOne({ 'local.email': email }, function(err, user) {
				 	console.log(user);
			      	if (err) { return done(err); }
			      	if (!user) {
			        	return done(null, false, { message: 'Incorrect username.' });
			      	}
			      	return done(null, user);
			      	bcrypt.compare(password, user.local.password, function(err, isMatch) {
			         	if (isMatch === true && !err) {
			            	return done(null, user);
			          	} else {
			            	return done(null, false, { message: 'Incorrect password.' });
			          	}
			      });
			    });
			})
			// User.getAuthenticated(username, password, function(err, user, reason) {
			// 	console.log("hello")
			// 	// if there's an error, then return the error
			// 	if (err)
			// 		return done(err);

			// 	if (user) { // the user successfully logs in
			// 		return done(null, user);
			// 	}
			// 	else { // otherwise determine why the login failed
			// 		var reasons = User.failedLogin;
			// 		switch(reasons) {
			// 			case reasons.MAX_ATTEMPTS:
			// 				console.log("too many tries");
			// 				// send email or notify the user that the account is temporarily locked
			// 				return done(null, false, { error: "Too many failed login attempts. Please wait a few minutes before you try again." });
			// 				break;
			// 		}
			// 		return done(null, false, { error: "The username or password is incorrect" });
			// 	}
			// });
		// }
	);
};