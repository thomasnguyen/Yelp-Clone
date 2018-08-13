const passport = require('passport');

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
