const express = require('express');
const router = express.Router();

const organizationsRouter = require('./organizations');
const stripeRouter = require('./stripe');

router.use('/organizations', organizationsRouter);
router.use('/stripe', stripeRouter);

module.exports = router;
