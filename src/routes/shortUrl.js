const express = require('express');
const router = express.Router();
const controller = require('../controller/shortUrlController.js');


router.post('/', controller.createShortUrl);


router.get('/:shortcode', controller.getStats);


module.exports = router;