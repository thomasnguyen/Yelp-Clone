exports.myMiddlware = (req, res, next) => {
	req.name = 'Wes';
	res.cookie('name', 'wes is cool', { maxAge: 900000 });
	if (req.name === 'Wes') {
		throw Error('That is a stupid name');
	}

	next(); // passes to the next parameters
};

exports.homePage = (req, res) => {
	console.log(req.name);
	res.render('index');
};
