const express = require('express');
const router = express.Router();
const { getStripeConfig, createPaymentIntent, handleWebhook } = require('../controllers/stripe');

router.post('/config', getStripeConfig);

router.post('/create-payment-intent', createPaymentIntent);

router.post('/webhook', handleWebhook);

module.exports = router;