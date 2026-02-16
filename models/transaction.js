const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true
    },
    payment_title:{ type: String },
    payment_description:{ type: String },
    returnUrl:{ type: String },
    customer_name: { type: String },
    customer_email: { type: String },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'GBP'
    },
    provider: {type: Array, default: []},
    cardEnabled:{type: Boolean, default: false},
    bankTransferAutomatic:{type: Boolean, default: false},
    bankTransferManual:{type: Boolean, default: false},
    organization_id: {
        type: String,
        ref:"Organization",
        required: true,
        index: true
    },
    order_id: {
        type: String,
        required: true
    },
    processing_fee: {
        type: Number,
        default: 0.00
    },
    status: {
        type: String,
        enum: ['paid', 'unpaid', 'refunded', 'failed'],
        default: 'unpaid'
    },
    paymentLink: { type: String },
    stripe_payment_intent_id: { type: String },
    stripe_payment_id: { type: String },
    refund_ammount: { type: Number },
}, { timestamps: true });

TransactionSchema.index({ uuid: 1, status: 1 });

module.exports = mongoose.model('Transaction', TransactionSchema);