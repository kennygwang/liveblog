var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Post = new Schema({
	timeCreated: { type: Date },
	postType: { type: String }, // text post, image post, video post(maybe)
	text: { type: String },
	title: { type: String },
	url: { type: String } // for images or videos
});

module.exports = mongoose.model('Post', Post);