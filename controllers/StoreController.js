const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
	req.flash('error', 'Something happened');
	req.flash('success', 'Something happened');
	req.flash('info', 'Something happened');
	req.flash('warning', 'Something happened');
	res.render('index');
};

exports.addStore = (req, res) => {
	res.render('editStore', { title: 'Add Store' });
};

exports.createStore = async (req, res) => {
	const store = await new Store(req.body).save();
	req.flash('success', `Successfuly created ${store.name}. Care to leave a review`);
	res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
	// 1. Query the database of list of stores
	const stores = await Store.find();
	console.log(stores);
	res.render('stores', { title: 'Stores', stores });
};
