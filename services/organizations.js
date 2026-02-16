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

// const getTransactionByUuid = async (uuid) => {
//     const transaction = await Transaction.findOne({ uuid });
//     if (!transaction) {
//         return null;
//     }
//     const organization = await Organization.findOne({ organization_id: transaction.organization_id });
//     console.log("organization", organization);
//     return {
//         ...transaction.toObject(),
//         organization_name: organization?.name || '',
//         organization_status: organization?.status || '',
//         logo_url: organization?.logo_url || ''
//     };
// };




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

const deleteOrganization = async (organization_id) => {
    const organization = await Organization.findOne({ organization_id });
    if (!organization) {
        return null;
    }
    // Delete all transactions for this organization first (cascade)
    await Transaction.deleteMany({ organization_id });
    const deletedOrg = await Organization.findOneAndDelete({ organization_id });
    return deletedOrg;
};

const updateOrganizationStatus = async (organization_id, status) => {
    // Validate status
    if (!['active', 'inactive'].includes(status)) {
        throw new Error('Status must be either "active" or "inactive"');
    }
    
    const updatedOrg = await Organization.findOneAndUpdate(
        { organization_id },
        { $set: { status } },
        { new: true, runValidators: true }
    );
    
    return updatedOrg;
};

const getTransactionsByOrganization = async (organization_id, page, limit, search) => {
    const skip = (page - 1) * limit;
    const transactions = await Transaction.find({ organization_id, $or: [
        { customer_name: { $regex: search, $options: 'i' } }, 
        { order_id: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } }, 
        { provider: { $regex: search, $options: 'i' } } 
    ] }).skip(skip).limit(limit).sort({ createdAt: -1 }).populate({
        path: 'organization_id',   
        model: 'Organization',     
        foreignField: 'organization_id',
      });
    const total = await Transaction.countDocuments({ organization_id }).sort({ createdAt: -1 });
    return {
        transactions,
        pagination: {
            total,
            page,
            limit
        }
    };
};



module.exports = {
    addOrganization,
    getOrganization,
    createPaymentLink,
    updateTransaction,
    updatePaymentLink,
    deletePaymentLink,
    getAllOrganizations,
    getTransactionsByOrganization,
    deleteOrganization,
    updateOrganizationStatus,

}