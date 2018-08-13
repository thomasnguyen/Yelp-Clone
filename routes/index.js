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

module.exports = router;
