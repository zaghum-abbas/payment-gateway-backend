const express = require('express');
const { getAllTransactions, searchTransactions } = require('../controllers');
const router = express.Router();

router.get('/search', searchTransactions);
router.get('/', getAllTransactions);

module.exports = router;