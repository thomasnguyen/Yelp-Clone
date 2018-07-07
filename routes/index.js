const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
	const thomas = { name: 'Thomas', age: 25, cool: true };
	//res.send('Hey! It works! DUNDUN DUN');
	//res.json(thomas);
	//res.send(req.query.name);
	//res.send(req.query);

	res.render('hello', {
		name: 'wes',
		dog: req.query.dog
	});
});

router.get('/reverse/:name', (req, res) => {
	const reverse = [ ...req.params.name ].reverse().join('');
	res.send(reverse);
});

module.exports = router;
