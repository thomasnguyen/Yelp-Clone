const express = require('express');
const router = express.Router();
const storeController = require('../controllers/StoreController');

router.get('/', storeController.homePage);

module.exports = router;
