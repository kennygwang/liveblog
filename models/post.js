var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Post = new Schema({
	timeCreated: { type: Date, default: Date.now() },
	postType: { type: String, default: "text" }, // text post, image post, video post(maybe)
	text: { type: String, default: "" },
	caption: { type: String, default: "" },
	url: { type: String, default: "" } // for images or videos
});

module.exports = mongoose.model('Post', Post);