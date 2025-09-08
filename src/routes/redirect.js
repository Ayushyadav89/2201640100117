// src/routes/redirect.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/redirectController');


// redirect route: /:shortcode
router.get('/:shortcode', controller.redirectToOriginal);


module.exports = router;