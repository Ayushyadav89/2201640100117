const express = require('express');
const router = express.Router();
const controller = require('../controllers/shorturlsController');


// create short url
router.post('/', controller.createShortUrl);


// get stats
router.get('/:shortcode', controller.getStats);


module.exports = router;