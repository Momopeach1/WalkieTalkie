const express = require('express');
const router = express.Router();

const firebaseController = require('./firebase');

router.use('/firebase', firebaseController);

module.exports = router;