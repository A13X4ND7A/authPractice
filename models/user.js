const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'Username cannot be blank'],
	},
	hashedPassword: {
		type: String,
		required: [true, 'Password cannot be blank'],
	},
});

userSchema.statics.findAndValidate = async function (username, password) {
	const foundUser = await this.findOne({username});
	const isMatch = await bcrypt.compare(password, foundUser.hashedPassword);
	return isMatch ? foundUser : false;
};

userSchema.pre('save', async function (next) {
	this.password = await bcrypt.hash(this.hashedPassword, 12);
	next();
});

module.exports = mongoose.model('User', userSchema);
