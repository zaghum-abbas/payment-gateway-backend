const { OrganizationsService } = require('../services');
const { v4: uuidv4 } = require('uuid');
const { hashToken } = require('../utils/hash');


const addOrganization = async (req, res) => {
    try {
        const { name, organization_id, api_token } = req.body;

        const organization = await OrganizationsService.getOrganization(organization_id);
        if (organization) {
            return res.status(400).json({ success: false, message: "Organization already exists" });
        }

        const hashedToken =  hashToken(api_token);
        const newOrg = await OrganizationsService.addOrganization({
            name,
            api_token: hashedToken,
            organization_id: organization_id,
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
    let uuid = uuidv4();
    try {
        const frontendOrigin = req.get('origin'); 

        const fullPaymentUrl = `${frontendOrigin}/pay/${uuid}`;
        
        const { amount, currency, customer_name, customer_email, order_id ,provider,payment_title,payment_description,returnUrl,cardEnabled,bankTransferAutomatic,bankTransferManual} = req.body;
        const paymentLink = await OrganizationsService.createPaymentLink({
            uuid: uuid,
            organization_id: req.org.organization_id,
            amount: parseFloat(amount),
            currency: currency,
            customer_name,
            customer_email,
            status: 'unpaid',
            order_id: order_id,
            paymentLink:fullPaymentUrl,
            provider:provider,
            payment_title:payment_title,
            payment_description:payment_description,
            returnUrl:returnUrl,
            cardEnabled:cardEnabled,
            bankTransferAutomatic:bankTransferAutomatic,
            bankTransferManual:bankTransferManual
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
        const { uuid, } = req.params;
        const { page , limit  ,search} = req.query;
        const transaction = await OrganizationsService.getTransactions(uuid, page, limit, search);

        console.log("transaction", transaction);

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

const editPaymentLink = async (req, res) => {
    try {
        const { uuid } = req.params;

        const { amount, currency, customer_name, customer_email, order_id, provider ,payment_title,payment_description,returnUrl,cardEnabled,bankTransferAutomatic,bankTransferManual} = req.body;
        // Build update data object
        const updateData = {};
        if (amount !== undefined) updateData.amount = parseFloat(amount);
        if (currency !== undefined) updateData.currency = currency;
        if (customer_name !== undefined) updateData.customer_name = customer_name;
        if (customer_email !== undefined) updateData.customer_email = customer_email;   
        if (order_id !== undefined) updateData.order_id = order_id;
        if (provider !== undefined) updateData.provider = provider;
        if (payment_title !== undefined) updateData.payment_title = payment_title;
        if (payment_description !== undefined) updateData.payment_description = payment_description;
        if (returnUrl !== undefined) updateData.returnUrl = returnUrl;
        if (cardEnabled !== undefined) updateData.cardEnabled = cardEnabled;
        if (bankTransferAutomatic !== undefined) updateData.bankTransferAutomatic = bankTransferAutomatic;
        if (bankTransferManual !== undefined) updateData.bankTransferManual = bankTransferManual;

        // Update payment link URL if amount or other fields changed
        if (Object.keys(updateData).length > 0) {
            const frontendOrigin = req.get('origin');
            if (frontendOrigin) {
                updateData.paymentLink = `${frontendOrigin}/pay/${uuid}`;
            }
        }

        const updatedPaymentLink = await OrganizationsService.updatePaymentLink(
            uuid,
            updateData
        );

        if (!updatedPaymentLink) {
            return res.status(404).json({
                success: false,
                message: 'Payment link not found or you do not have permission to edit it'
            });
        }

        res.json({
            success: true,
            message: 'Payment link updated successfully',
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const deletePaymentLink = async (req, res) => {
    try {
        const { uuid } = req.params;
        const organization_id = req.org.organization_id;

        const deletedPaymentLink = await OrganizationsService.deletePaymentLink(
            uuid,
            organization_id
        );

        if (!deletedPaymentLink) {
            return res.status(404).json({
                success: false,
                message: 'Payment link not found or you do not have permission to delete it'
            });
        }

        res.json({
            success: true,
            message: 'Payment link deleted successfully',
            data: {
                uuid: deletedPaymentLink.uuid,
                deletedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
        const { page = 1, limit = 10 ,search,filterBy} = req.query;
        const { organization_id } = req.params;
        const transactions = await OrganizationsService.getTransactionsByOrganization(organization_id, page, limit, search,filterBy);

        res.json({
            success: true,
            data: transactions.transactions,
            pagination: transactions.pagination
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}



const deleteOrganization = async (req, res) => {
    try {
        const { organization_id } = req.params;
        const deletedOrg = await OrganizationsService.deleteOrganization(organization_id);

        if (!deletedOrg) {
            return res.status(404).json({
                success: false,
                message: 'Organization not found'
            });
        }

        res.json({
            success: true,
            message: 'Organization deleted successfully',
            data: {
                organization_id: deletedOrg.organization_id,
                name: deletedOrg.name
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const updateOrganizationStatus = async (req, res) => {
    try {
        const { organization_id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be either "active" or "inactive"'
            });
        }

        const updatedOrg = await OrganizationsService.updateOrganizationStatus(organization_id, status);

        if (!updatedOrg) {
            return res.status(404).json({
                success: false,
                message: 'Organization not found'
            });
        }

        res.json({
            success: true,
            message: `Organization status updated to ${status} successfully`,
            data: {
                organization_id: updatedOrg.organization_id,
                name: updatedOrg.name,
                status: updatedOrg.status
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    addOrganization,
    createPaymentLink,
    getTransaction,
    updateTransaction,
    editPaymentLink,
    deletePaymentLink,
    getAllOrganizations,
    getOrganizationTransactions,
    deleteOrganization,
    updateOrganizationStatus,
}