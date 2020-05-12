const express = require('express');
const router = express.Router();

const userController = require('./user');
const channelController = require('./channel');
const messageController = require('./message');

router.use('/user', userController);
router.use('/channel', channelController);
router.use('/message', messageController);

module.exports = router;