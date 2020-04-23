const express = require('express');
const router = express.Router();

const userController = require('./user');

router.use('/user', userController);

module.exports = router;