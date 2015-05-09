var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Post = mongoose.model('Post');

var Blog = new Schema({
	authorId	: { type: Schema.Types.ObjectId },
	authorName	: { type: String, default: "" },
	posts 		: { type: [ Post ], default: [] },
	timeCreated	: { type: Date, default: Date.now() },
	lastUpdated	: { type: Date, default: Date.now() },
	title		: { type: String, required: true }
});

module.exports = mongoose.model('Blog', Blog);