// load libraries we need
var LocalStrategy = require('passport-local').Strategy
  , RememberMeStrategy = require('passport-remember-me').Strategy;
// load all necessary models
var User = require('../models/user')
  , Token = require('../models/token');
// load any functions needed
var stringGenerator = require('../stringGenerator');


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
		function(username, password, done) {
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
							return done(null, false, { errorMessages: "Too many failed login attempts. Please wait a few minutes before you try again." });
							break;
					}
					return done(null, false, { errorMessages: "The username or password is incorrect" });
				}
			});
		}
	));	

	// remember me strategy using passport
	passport.use(new RememberMeStrategy(
		function(token, done) {
			Token.consume(token, function(err, uid) {
				if (err)
					done(err);

				if (!uid)
					return done(null, false);

				User.findById(uid, function(err, user) {
					if (err)
						return done(err);

					if (!user)
						return done(null, false);

					return done(null, user);
				});
			});
		},
		function(user, done) {
			var tokenString = stringGenerator.randomString(64);
			var token = new Token({
				token: tokenString,
				uid: user._id
			});

			token.save(function(err) {
				if (err) 
					return done(err);

				return done(null, token);
			});
		}
	));
};