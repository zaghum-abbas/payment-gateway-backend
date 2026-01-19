const { OrganizationsService } = require('../services');
const { v4: uuidv4 } = require('uuid');
const { generateRawToken, hashToken } = require('../utils/hash');


const addOrganization = async (req, res) => {
    try {
        const { name, owner_email, organization_id, api_token } = req.body;

        const organization = await OrganizationsService.getOrganization(organization_id);
        if (organization) {
            return res.status(400).json({ success: false, message: "Organization already exists" });
        }

        const hashedToken = await hashToken(api_token);
        const newOrg = await OrganizationsService.addOrganization({
            name,
            api_token: hashedToken,
            organization_id: organization_id,
            owner_email,
        });

        res.status(201).json({
            success: true,
            message: "Organization registered successfully",
            data: {
                organization_id: newOrg.organization_id,
                name: newOrg.name,
                api_token: newOrg.api_token,
                warning: "Store this token! We only show it once."
            }
        });

    } catch (error) {
        console.log("error", error);

        res.status(400).json({ success: false, message: error.message });
    }
}

const createPaymentLink = async (req, res) => {
    try {
        const { amount, currency, customer_name, customer_email, order_id } = req.body;
        const paymentLink = await OrganizationsService.createPaymentLink({
            uuid: uuidv4(),
            organization_id: req.org.organization_id,
            amount: parseFloat(amount),
            currency: currency || 'GBP',
            customer_name,
            customer_email,
            status: 'pending',
            order_id: order_id,

        });

        res.json({
            success: true,
            message: "Payment link created successfully",
            uuid: paymentLink.uuid
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getTransaction = async (req, res) => {
    try {
        const { uuid } = req.params;
        const transaction = await OrganizationsService.getTransactionByUuid(uuid);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found'
            });
        }

        res.json({
            success: true,
            data: transaction
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const updateTransaction = async (req, res) => {
    try {
        const { uuid } = req.params;
        const updateData = req.body;

        const transaction = await OrganizationsService.updateTransaction(uuid, updateData);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found'
            });
        }

        res.json({
            success: true,
            message: 'Transaction updated successfully',
            data: transaction
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const getAllOrganizations = async (req, res) => {
    try {
        const organizations = await OrganizationsService.getAllOrganizations();

        res.json({
            success: true,
            data: organizations
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const getOrganizationTransactions = async (req, res) => {
    try {
        const { organization_id } = req.params;
        const transactions = await OrganizationsService.getTransactionsByOrganization(organization_id);

        res.json({
            success: true,
            data: transactions
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const getAllTransactions = async (req, res) => {
    try {
        const transactions = await OrganizationsService.getAllTransactions();

        res.json({
            success: true,
            data: transactions
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    addOrganization,
    createPaymentLink,
    getTransaction,
    updateTransaction,
    getAllOrganizations,
    getOrganizationTransactions,
    getAllTransactions
}