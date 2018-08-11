const mongoose = require('mongoose');

exports.loginForm = (req, res) => {
	res.render('login', { title: 'login' });
};

exports.registerForm = (req, res) => {
	res.render('register', { title: 'Register' });
};

exports.validateRegister = (req, res, next) => {
	req.sanitizeBody('name');
	req.checkBody('name', 'You must supply name').notEmpty();
	req.checkBody('email', 'That email is not valid').isEmail();
	req.sanitizeBody('email').normalizeEmail({
		remove_dots: false,
		remove_extension: false,
		gmail_remove_subaddress: false
	});
	req.checkBody('password', 'Password can not be empty').isEmail();
	req.checkBody('passwordConfirm', 'Password Confirm can not be empty').isEmail();
	req.checkBody('passwordConfirm', 'Passwords are not the same').isEqual(req.body.password);

	const errors = req.validationErrors();
	if (errors) {
		req.flash('error', errors.map((err) => err.msg));
		res.render('register', { title: 'Register', body: body, flashes: req.flash() });
	} else {
	}
};
