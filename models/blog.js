var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Post = mongoose.model('Post');

var Blog = new Schema({
	authorId	: { type: Schema.Types.ObjectId },
	authorName	: { type: String },
	posts 		: { type: [ Post ] },
	timeCreated	: { type: Date },
	lastUpdated	: { type: Date },
	title		: { type: String }
});

module.exports = mongoose.model('Blog', Blog);