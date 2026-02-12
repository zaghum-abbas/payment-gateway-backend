const { Transaction } = require("../models/index");
const { Organization } = require("../models/index");


const addOrganization = async ({ name, api_token, organization_id }) => {
    const organization = await Organization.create({ name, api_token, organization_id});
    return organization;
};

const getOrganization = async (organization_id) => {
    const organization = await Organization.findOne({ organization_id });
    return organization;
};

const createPaymentLink = async ({ uuid, organization_id, amount, currency, customer_name, customer_email, order_id, status ,paymentLink,provider,payment_title,payment_description,returnUrl,cardEnabled,bankTransferAutomatic,bankTransferManual}) => {
    const linkPath = await Transaction.create({ uuid, organization_id, amount, currency, customer_name, customer_email, order_id, status ,paymentLink ,provider,payment_title,payment_description,returnUrl,cardEnabled,bankTransferAutomatic,bankTransferManual});
    return linkPath;
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

const updatePaymentLink = async (uuid, updateData) => {
    console.log("uui",uuid);
    const updatedTransaction = await Transaction.findOneAndUpdate(
        { uuid: uuid }, // 1. Find the doc where the 'uuid' field matches
        { $set: updateData }, // 2. Only update the fields provided
        { new: true } // 3. Return the NEW version of the doc, not the old one
    );
    console.log("updatedTransaction",updatedTransaction);
    return updatedTransaction;
};

const deletePaymentLink = async (uuid, organization_id) => {
    // Verify the payment link belongs to the organization
    const transaction = await Transaction.findOne({ uuid, organization_id });
    if (!transaction) {
        return null;
    }
    
    // Delete the payment link
    const deletedTransaction = await Transaction.findOneAndDelete({ uuid, organization_id });
    return deletedTransaction;
};

const getAllOrganizations = async () => {
    const organizations = await Organization.find({}).sort({ createdAt: -1 });
    return organizations;
};

const getTransactionsByOrganization = async (organization_id) => {
    const transactions = await Transaction.find({ organization_id }).sort({ createdAt: -1 }).populate({
        path: 'organization_id',   
        model: 'Organization',     
        foreignField: 'organization_id',
      });
    return transactions;
};

const getAllTransactions = async () => {
    const transactions = await Transaction.find().sort({ createdAt: -1 }).populate({
        path: 'organization_id',   
        model: 'Organization',     
        foreignField: 'organization_id',
      });
    return transactions;
};

module.exports = {
    addOrganization,
    getOrganization,
    createPaymentLink,
    getTransactionByUuid,
    updateTransaction,
    updatePaymentLink,
    deletePaymentLink,
    getAllOrganizations,
    getTransactionsByOrganization,
    getAllTransactions
}