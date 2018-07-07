const express = require('express');
const router = express.Router();
const storeController = require('../controllers/StoreController');

router.get('/', storeController.myMiddlware, storeController.homePage);

module.exports = router;
