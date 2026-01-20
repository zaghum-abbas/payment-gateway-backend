const { Transaction } = require("../models/index");
const { Organization } = require("../models/index");


const addOrganization = async ({ name, api_token, organization_id, owner_email }) => {
    const organization = await Organization.create({ name, api_token, organization_id, owner_email });
    return organization;
};

const getOrganization = async (organization_id) => {
    const organization = await Organization.findOne({ organization_id });
    return organization;
};

const createPaymentLink = async ({ uuid, organization_id, amount, currency, customer_name, customer_email, order_id, status }) => {
    const paymentLink = await Transaction.create({ uuid, organization_id, amount, currency, customer_name, customer_email, order_id, status });
    return paymentLink;
};

const getTransactionByUuid = async (uuid) => {
    const transaction = await Transaction.findOne({ uuid });
    if (!transaction) {
        return null;
    }
    const organization = await Organization.findOne({ organization_id: transaction.organization_id });
    return {
        ...transaction.toObject(),
        organization_name: organization?.name || '',
        logo_url: organization?.logo_url || ''
    };
};

const updateTransaction = async (uuid, updateData) => {
    const transaction = await Transaction.findOneAndUpdate(
        { uuid },
        { $set: updateData },
        { new: true }
    );
    return transaction;
};

const getAllOrganizations = async () => {
    const organizations = await Organization.find({}).sort({ createdAt: -1 });
    return organizations;
};

const getTransactionsByOrganization = async (organization_id) => {
    const transactions = await Transaction.find({ organization_id }).sort({ createdAt: -1 });
    return transactions;
};

const getAllTransactions = async () => {
    const transactions = await Transaction.find({}).sort({ createdAt: -1 });
    return transactions;
};

module.exports = {
    addOrganization,
    getOrganization,
    createPaymentLink,
    getTransactionByUuid,
    updateTransaction,
    getAllOrganizations,
    getTransactionsByOrganization,
    getAllTransactions
}