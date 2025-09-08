const express = require('express');
const router = express.Router();
const controller = require('../controller/redirectController.js');

router.get('/:shortcode', controller.redirectToOriginal);


module.exports = router;