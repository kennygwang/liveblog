var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10;
// load token generator
var stringGenerator = require('../stringGenerator');

var Token = new Schema({
	token  : { type: String, required: true },
	uid    : { type: Schema.Types.ObjectId, unique: true, required: true }
});

/**
 * Consumes a token used for remember me.
 */
Token.statics.consume = function(token, cb) {
	var uid; // the user id to pass to the page
    // find the matching token
    this.findOne({ 'token': token.token }, function(err, data) {
        if (err)
            return cb(err);

        if (data) { // a token is found
            var uid = data.uid;
            data.remove(); // remove the token from the db
            return cb(null, uid);
        } else { // no token is found
            return cb(null, false);
        }
    });
};

module.exports = mongoose.model('Token', Token);