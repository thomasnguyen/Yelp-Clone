const express = require('express');
const router = express.Router();
const storeController = require('../controllers/StoreController');

router.get('/', storeController.homePage);
router.get('/add', storeController.addStore);
router.post('/add', storeController.createStore);

module.exports = router;
