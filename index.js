const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/user');
const bcrypt = require('bcrypt');
const session = require('express-session');

mongoose
	.connect('mongodb://localhost:27017/authDemo', {useNewUrlParser: true})
	.then(() => {
		console.log(`Connected to MongoDB`);
	})
	.catch((err) => {
		console.log(`Error connecting to MongoDB: ${err}`);
	});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({extended: true}));
app.use(session({secret: 'notagoodsecret'}));

app.get('/', (req, res) => {
	res.send('This is the home page');
});

app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', async (req, res) => {
	const {password, username} = req.body;
	const hash = await bcrypt.hash(password, 12);
	const user = new User({
		username,
		hashedPassword: hash,
	});
	await user.save();
	req.session.user_id = user._id;
	res.redirect('/');
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.post('/login', async (req, res) => {
	const {username, password} = req.body;
	const user = await User.findOne({username});
	if (!user) {
		res.redirect('/register');
	} else {
		const isMatch = await bcrypt.compare(password, user.hashedPassword);
		if (isMatch) {
			req.session.user_id = user._id;
			res.redirect('/secret');
			0;
		} else {
			res.redirect('/login');
		}
	}
});

app.get('/secret', (req, res) => {
	if (!req.session.user_id) {
		res.redirect('/login');
	} else {
		res.send('THIS IS A SECRET AND YOU CAN NOW SEE IT');
	}
});

app.listen(3000, () => {
	console.log('Listening on port 3000');
});
