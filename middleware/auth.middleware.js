const { Organization } = require('../models/index');
const bcrypt = require('bcrypt');

const authorizeOrg = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing API Token' });
    }

    const rawToken = authHeader.split(' ')[1];
    const orgId = req.body.organization_id;

    const org = await Organization.findOne({ organization_id: orgId });
    if (!org) return res.status(401).json({ error: 'Invalid Organization' });

    const isValid = await bcrypt.compare(rawToken, org.api_token);
    if (!isValid) return res.status(401).json({ error: 'Invalid Token' });

    req.org = org;
    next();
};

module.exports = {
    authorizeOrg
}