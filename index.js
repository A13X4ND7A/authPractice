const bcrypt = require('bcrypt');

const hashedPassword = async () => {
	const salt = await bcrypt.genSalt(10);
	console.log(salt);
};
