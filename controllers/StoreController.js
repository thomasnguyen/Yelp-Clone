const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const multerOptions = {
	storage: multer.memoryStorage(),
	fileFilter(req, file, next) {
		const isPhoto = file.mimetype.startsWith('image/');
		if (isPhoto) {
			next(null, true);
		} else {
			next({ message: "That file type isn't allowed!" }, false);
		}
	}
};
const jimp = require('jimp');
const uuid = require('uuid');

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

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
	// check if there is no new file to resize
	if (!req.file) {
		next();
		return; // skip to the next middleware
	}
	console.log(req.file);
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

exports.editStore = async (req, res) => {
	// 1. Find the store given the id
	const store = await Store.findOne({ _id: req.params.id });
	// 2. Confirm they are the owner of the store
	// TODO
	// 3. Render out the edit the form so the user can update their store
	res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
	// set the location data to be a point
	req.body.location.type = 'Point';
	// find and update the store
	const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true, // return the new sotre instead of the old one
		runValidators: true
	}).exec();

	req.flash(
		'success',
		`Succesfully updated <strong>${store.name}</strong>. 
				<a href="/stores/${store.slug}"> VIew Stores </a>`
	);

	res.redirect(`/stores/${store._id}/edit`);
};
