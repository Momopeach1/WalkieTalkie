const express = require('express');
const router = express.Router();

const chatController = require('./chat');

router.use('/chat',chatController);

module.exports = router;