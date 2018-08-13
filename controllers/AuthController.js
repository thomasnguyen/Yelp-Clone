const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.login = passport.authenticate('local', {
	failureRedirect: '/login',
	failureFlash: 'Failed Login!',
	successRedirect: '/',
	successFlash: 'You are now logged in!'
});

exports.logout = (req, res) => {
	req.logout();
	req.flash('success', 'You are now logged out!');
	res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
	// first check if user is auth
	if (req.isAuthenticated()) {
		next(); // carry on!
	} else {
		req.flash('error', 'Ooops!');
		res.redirected('/login');
	}
};

exports.account = (req, res) => {
	res.render('account', { title: 'Edit Your Account' });
};

exports.updateAccount = async (req, res) => {
	const updates = {
		name: req.body.name,
		email: req.body.email
	};

	const user = await User.findOneAndUpdate(
		{ _id: req.user._id },
		{ $set: updates },
		{ new: true, runValidators: true, context: 'query' }
	);

	req.flash('success', 'Updated the profile!');
	res.redirect('/account');
};
