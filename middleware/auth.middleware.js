const { Organization } = require('../models/index');
const { Transaction } = require('../models/index');
const { decryptData } = require('../utils/hash');

const authorizeOrg = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing API Token' });
    }

    const rawToken = authHeader.split(' ')[1];
    let orgId = req.body?.organization_id;

    // Check for uuid or id parameter (id is used for payment-link routes)
    // Priority: get organization_id from payment link UUID if available
    const paymentLinkId = req.params?.uuid || req.params?.id;
    if (paymentLinkId) {
        const transaction = await Transaction.findOne({ uuid: paymentLinkId });
        if (!transaction) {
            return res.status(404).json({ error: 'Payment link not found' });
        }
        orgId = transaction.organization_id;
    }

    // If still no orgId, check body (for create-payment-link endpoint)
    if (!orgId && req.body?.organization_id) {
        orgId = req.body.organization_id;
    }

    if (!orgId) {
        return res.status(400).json({ error: 'Organization ID is required' });
    }

    const org = await Organization.findOne({ organization_id: orgId });
    if (!org) return res.status(401).json({ error: 'Invalid Organization' });

    const isValid = decryptData(rawToken, org.api_token);
    if (!isValid) return res.status(401).json({ error: 'Invalid Token' });

    req.org = org;
    next();
};

module.exports = {
    authorizeOrg
}