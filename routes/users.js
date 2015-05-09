var mongoose = require('mongoose')
  , Blog = mongoose.model('Blog')
  , User = mongoose.model('User');

/**
 * Creates a user from the body fields, and sends the user in the response.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.create = function(req, res) {
	if (!req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName) {
		return res.status(400).json({ message: 'Empty field.', data: {} }); // bad request status
	}

	var user = new User({
		local: {
			email: req.body.email,
			password: req.body.password
		},
		pub: {
			firstName: req.body.firstName,
			lastName: req.body.lastName
		}
	});

	user.save(function(err) {
		if (err) {
			res.status(500).json({ message: 'Server error.', data: err });
		} else {
			res.status(201).json({ message: 'User created.', data: user }) // user created status
		}
	});
};

/**
 * Returns all users.
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
exports.list = function(req, res) {
	User.find(function(err, data) {
		if (err) {
			res.status(500).json({ message: 'Server error.', data: err });
		} else {
			res.status(200).json({ message: 'OK.', data: {} });
		}
	});
};

/**
 * Deletes the user with the specified id along with any blogs made by that user.
 * @param  {Object} req Request object
 * @param  {Object} res Response object
 */
exports.delete = function(req, res) {
	var id = mongoose.Types.ObjectId(req.params.id);

	User.findAndModify({ query: { _id: id }, remove: true }, function(err, user) {
		if (err) {
			return res.status(500).json({ message: 'Server error.', data: err });
		}

		if (user) {
			// delete all blogs owned by the deleted user
			Blog.remove({ _id: { $in: user.pub.blogs } }, function(err, blogs) {
				if (err) {
					res.status(500).json({ memssage: 'Server error.', data: err });
				} else {
					res.status(200).json({ message: 'User successfully deleted.', data: {} });
				}
			});
		} else {
			res.status(404).json({ message: 'User not found.', data: {} });
		}
	})
}

