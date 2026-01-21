const { OrganizationsService } = require('../services');
require('dotenv').config();

// Validate Stripe key exists
if (!process.env.STRIPE_SECRET_KEY) {
    console.error('CRITICAL: STRIPE_SECRET_KEY is not set in environment variables');
}

console.log("process.env.STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY)

const stripe = process.env.STRIPE_SECRET_KEY
    ? require('stripe')(process.env.STRIPE_SECRET_KEY)
    : null;

const getStripeConfig = async (req, res) => {
    const { organization_id } = req.body;
    const org = await OrganizationsService.getOrganization(organization_id);
    if (!org) return res.status(404).json({ error: 'Organization not found' });

    res.json({
        publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
        success: true,
    });
}

const createPaymentIntent = async (req, res) => {
    try {
        // Check if Stripe is initialized
        if (!stripe) {
            return res.status(500).json({
                error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.'
            });
        }

        const { uuid, amount, currency, customer_email, customer_name } = req.body;

        // 1. Verify transaction exists and is pending
        const transaction = await OrganizationsService.getTransactionByUuid(uuid);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        if (transaction.status !== 'unpaid') {
            return res.status(400).json({ error: 'Transaction already processed' });
        }

        // 2. Create Stripe Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency.toLowerCase(),
            receipt_email: customer_email,
            metadata: {
                transaction_uuid: uuid,
                order_id: transaction.order_id,
                customer_name: customer_name,
                organization_id: transaction.organization_id
            },
            description: `Payment for Order #${transaction.order_id}`
        });

        // 3. Save Stripe Payment Intent ID to transaction
        await OrganizationsService.updateTransaction(uuid, {
            stripe_payment_intent_id: paymentIntent.id,
            provider: 'stripe'
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            payment_intent_id: paymentIntent.id
        });

    } catch (error) {
        console.error('Create payment intent error:', error);
        res.status(500).json({ error: error.message });
    }
};


console.log("process.env.STRIPE_WEBHOOK_SECRET", process.env.STRIPE_WEBHOOK_SECRET)
// const handleWebhook = async (req, res) => {
//     console.log('Webhook received:', req);
//     const sig = req.headers["stripe-signature"];
//     const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

//     let event;

//     try {

//         event = stripe.Webhook.construct_event(req.body, sig, webhookSecret)
//         console.log("event", event);
//     } catch (err) {
//         console.error('Webhook signature verification failed:', err.message);
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     console.log('Webhook event:', event);
//     switch (event.type) {
//         case 'payment_intent.succeeded':
//             const paymentIntent = event.data.object;
//             const uuid = paymentIntent.metadata.transaction_uuid;

//             // Update transaction status
//             await OrganizationsService.updateTransaction(uuid, {
//                 status: 'paid',
//                 stripe_payment_id: paymentIntent.id,
//                 payment_method: paymentIntent.payment_method
//             });

//             console.log(`Payment succeeded for transaction: ${uuid}`);
//             break;

//         case 'payment_intent.payment_failed':
//             const failedIntent = event.data.object;
//             const failedUuid = failedIntent.metadata.transaction_uuid;

//             await OrganizationsService.updateTransaction(failedUuid, {
//                 status: 'unpaid'
//             });

//             console.log(`Payment failed for transaction: ${failedUuid}`);
//             break;

//         default:
//             console.log(`Unhandled event type ${event.type}`);
//     }

//     res.json({ received: true });
// };

const handleWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('❌ Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            const uuid = paymentIntent.metadata.transaction_uuid;

            await OrganizationsService.updateTransaction(uuid, {
                status: 'paid',
                stripe_payment_id: paymentIntent.id,
                payment_method: paymentIntent.payment_method
            });
            break;

        case 'payment_intent.payment_failed':
            const failedIntent = event.data.object;
            const failedUuid = failedIntent.metadata.transaction_uuid;

            await OrganizationsService.updateTransaction(failedUuid, {
                status: 'failed'
            });
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
};

module.exports = {
    getStripeConfig,
    createPaymentIntent,
    handleWebhook
}