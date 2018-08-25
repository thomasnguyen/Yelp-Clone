const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const User = mongoose.model('User');
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

	const extension = req.file.mimetype.split('/')[1];
	req.body.photo = `${uuid.v4()}.${extension}`;
	// now we resize
	const photo = await jimp.read(req.file.buffer);
	await photo.resize(800, jimp.AUTO);
	await photo.write(`./public/uploads/${req.body.photo}`);
	// once we have written the photo to our filesystem, keep going
	next();
};

exports.createStore = async (req, res) => {
	req.body.author = req.user._id;
	const store = await new Store(req.body).save();
	req.flash('success', `Successfuly created ${store.name}. Care to leave a review`);
	res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
	const page = req.params.page || 1;
	const limit = 4;
	const skip = page * limit - limit;

	const storesPromise = Store.find().skip(skip).limit(limit);
	// 1. Query the database of list of stores
	// const stores = await Store.find();

	const countPromise = Store.count();

	const [ stores, count ] = await Promise.all([ storesPromise, countPromise ]);

	const pages = Math.ceil(count / limit);
	if (!stores.length && skip) {
		req.flash('info', 'Hey you asked for the wrong page!');
	}
	res.render('stores', { title: 'Stores', stores, page, pages, count });
};

const confirmOwner = (store, user) => {
	if (!store.author.equals(user._id)) {
		throw Error('You must own a store in order to edit it!');
		// return next();
	}
};

exports.editStore = async (req, res) => {
	// 1. Find the store given the id
	const store = await Store.findOne({ _id: req.params.id });
	// 2. Confirm they are the owner of the store
	//   // TODO
	confirmOwner(store, req.user);
	// 3. Render out the edit the form so the user can update their store
	res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.getStoreBySlug = async (req, res, next) => {
	const store = await Store.findOne({ slug: req.params.slug }).populate('author reviews');
	if (!store) {
		return next();
	}
	res.render('store', { title: store.name, store });
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

exports.getStoresByTag = async (req, res) => {
	const tag = req.params.tag;
	const tagQuery = tag || { $exists: true };
	const tagsPromise = Store.getTagsList();
	const storesPromise = Store.find({ tags: tagQuery });
	const [ tags, stores ] = await Promise.all([ tagsPromise, storesPromise ]);

	res.render('tags', { tags, title: 'Tags', tag, stores });
};

exports.searchStores = async (req, res) => {
	const stores = await Store.find(
		{
			$text: {
				$search: req.query.q
			}
		},
		{
			score: { $meta: 'textScore' }
		}
	)
		.sort({
			score: { $meta: 'textScore' }
		})
		.limit(5);
	res.json(stores);
};

exports.mapStores = async (req, res) => {
	const coordinates = [ req.query.lng, req.query.lat ].map(parseFloat);
	const q = {
		location: {
			$near: {
				$geometry: {
					type: 'Point',
					coordinates
				},
				$maxDistance: 10000 // 10km
			}
		}
	};
	const stores = await Store.find(q).select('slug name description location photo').limit(10);
	res.json(stores);
};

exports.mapPage = (req, res) => {
	res.render('map', { title: 'Map' });
};

exports.heartStore = async (req, res, next) => {
	const hearts = req.user.hearts.map((obj) => obj.toString());
	const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet';

	const user = await User.findByIdAndUpdate(req.user.id, { [operator]: { hearts: req.params.id } }, { new: true });

	res.json(user);
	// const heart = req.body.store;
	// console.log(heart);
};

exports.getHearts = async (req, res) => {
	const heartedStores = await Store.find({
		_id: { $in: req.user.hearts }
	});
	// res.json(heartedStores);

	res.render('hearts', { title: 'Your hearted stores!', heartedStores });
};

exports.getTopStores = async (req, res) => {
	const stores = await Store.getTopStores();
	//res.json(stores);
	res.render('topStores', { stores, title: 'Top Stores!' });
};
