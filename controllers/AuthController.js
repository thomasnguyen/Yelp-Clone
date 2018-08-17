const passport = require('passport');
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');

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

exports.forgot = async (req, res) => {
	// 1. See if user exists
	// 2. Set reset tokens and expiry on their account

	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		req.flash('error', 'No account with that email exists.');
		return res.rediect('/login');
	}
	// 2. Set reset tokens and expiry on their account

	user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
	user.resetPasswordExpires = Date.now() + 3600000;
	await user.save();

	// 3. Send Email with the token
	const resetUrl = `http://${req.headers.host}.account/reset/${user.resetPasswordToken}`;
	mail.send({
		user,
		subject: 'Password Reset',
		resetUrl,
		filename: 'password-reset'
	});
	req.flash('success', `You have been emailed a password reset link! ${resetUrl}`);
	// 4. Redirect to login page
	res.redirect('/login');
};

exports.reset = async (req, res) => {
	const user = await User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: { $gt: Date.now() }
	});

	if (!user) {
		req.flash('error', 'Password reset is invalid or has expired');
		res.rediect('/login');
	}

	res.render('reset', { title: 'Reset your password' });
};

exports.confirmedPasswords = (req, res, next) => {
	if (req.body.password === req.body['password-confirm']) {
		next();
		return;
	} else {
		req.flash('error', 'Passwords do not match!');
		req.redirect('back');
	}
};

exports.update = async (req, res) => {
	const user = await User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: { $gt: Date.now() }
	});

	if (!user) {
		req.flash('error', 'Password reset is invalid or has expired');
		res.rediect('/login');
	}

	const setPassword = promisify(user.setPassword, user);
	await setPassword(req.body.password);
	user.resetPasswordToken = undefined;
	user.resetPasswordExpires = undefined;
	const updatedUser = await user.save();
	await req.login(updatedUser);
	req.flash('Success', 'Your password has been reset!');
	res.rediect('/');
};
