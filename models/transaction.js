const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true
    },
    organization_id: {
        type: String,
        required: true,
        index: true
    },
    order_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'GBP'
    },
    processing_fee: {
        type: Number,
        default: 0.00
    },
    logo_url: { type: String },
    customer_name: { type: String },
    customer_email: { type: String },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed', 'expired'],
        default: 'pending'
    },
    provider: { type: String },
    stripe_payment_intent_id: { type: String },
    stripe_payment_id: { type: String },
    payment_method: { type: String },

}, { timestamps: true });

TransactionSchema.index({ uuid: 1, status: 1 });

module.exports = mongoose.model('Transaction', TransactionSchema);