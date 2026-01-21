const express = require('express');
const { getAllTransactions } = require('../controllers');
const router = express.Router();

router.get('/', getAllTransactions);

module.exports = router;