const express = require('express');
const router = express.Router();
const { getStripeConfig, createPaymentIntent, handleWebhook } = require('../controllers/stripe');

// Get Stripe configuration (publishable key)
router.post('/config', getStripeConfig);

// Create payment intent
router.post('/create-payment-intent', createPaymentIntent);

// Stripe webhook (must use raw body for signature verification)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;