const express = require('express');
const router = express.Router();
const { getStripeConfig, createPaymentIntent, handleWebhook, handleRefundRequest } = require('../controllers/stripe');

router.post('/config', getStripeConfig);

router.post('/create-payment-intent', createPaymentIntent);

router.post('/webhook', handleWebhook);

router.post('/refund', handleRefundRequest);

module.exports = router;