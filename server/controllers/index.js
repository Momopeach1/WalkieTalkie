const express = require('express');
const router = express.Router();

const userController = require('./user');
const channelController = require('./channel');

router.use('/user', userController);
router.use('/channel', channelController);

module.exports = router;