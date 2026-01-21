const express = require('express');
const router = express.Router();

const organizationsRouter = require('./organizations');
const stripeRouter = require('./stripe');
const transactionsRouter = require('./transactions');

router.use('/organizations', organizationsRouter);
router.use('/stripe', stripeRouter);
router.use('/transactions', transactionsRouter);

module.exports = router;
