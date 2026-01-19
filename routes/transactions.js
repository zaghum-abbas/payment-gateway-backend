const express = require('express');
const { getAllTransactions } = require('../conrollers');
const router = express.Router();

// This route is already prefixed with /api/transactions from the main router
router.get('/', getAllTransactions);  // GET /api/transactions

module.exports = router;