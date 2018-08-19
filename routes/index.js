const express = require('express');
const router = express.Router();
const storeController = require('../controllers/StoreController');
const userController = require('../controllers/userController');
const AuthController = require('../controllers/AuthController');

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', AuthController.isLoggedIn, storeController.addStore);

router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

router.post(
	'/add',
	storeController.upload,
	catchErrors(storeController.resize),
	catchErrors(storeController.createStore)
);

router.post('/add/:id', catchErrors(storeController.updateStore));

router.get('/stores/:id/edit', catchErrors(storeController.editStore));

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

router.get('/login', userController.loginForm);
router.post('/login', AuthController.login);

router.get('/register', userController.registerForm);
router.post('/register', userController.validateRegister, userController.register, AuthController.login);

router.get('/logout', AuthController.logout);

router.get('/account', AuthController.isLoggedIn, AuthController.account);
router.post('/account', AuthController.isLoggedIn, catchErrors(AuthController.updateAccount));
router.post('/account/forgot', catchErrors(AuthController.forgot));
router.get('/account/reset/:token', catchErrors(AuthController.reset));
router.post('/account/reset/:token', AuthController.confirmedPasswords, catchErrors(AuthController.update));

router.get('/api/search', catchErrors(storeController.searchStores));
router.get('/api/stores/near', catchErrors(storeController.mapStores));

router.get('/map', storeController.mapPage);
router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));

router.get('/hearts', AuthController.isLoggedIn, storeController.getHearts);
module.exports = router;
