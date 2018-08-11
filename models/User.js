const mongoose = require('mongoose');
const schema = mongoose.schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('password-local-mongoose');

const userSchema = new schema({
	email: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		validate: [ validator.isEmail, 'Invalid Email Address' ],
		required: 'Please supply a valid email address'
	},
	name: {
		type: String,
		required: 'Please supply a name',
		trim: true
	}
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
