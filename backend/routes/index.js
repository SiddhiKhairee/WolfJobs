const express = require('express');

const router = express.Router();

const homeController = require('../controllers/home_controller')

router.get('/', homeController.home);
router.use('/users',require('./users'));
router.use('/message', require('./message'));
router.use('/api',require('./api'));
router.use('/ai', require('./ai'));

module.exports = router;

