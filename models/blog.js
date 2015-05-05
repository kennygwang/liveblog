var mongoose = require('mongoose');

var Blog = new mongoose.Schema({
	authorId: { type: Schema.Types.ObjectId },
	authorName: { type: String }
});

module.exports = mongoose.model('Blog', Blog);