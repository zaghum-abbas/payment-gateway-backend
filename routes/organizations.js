const express = require('express');
const { addOrganization, getAllOrganizations, getOrganizationTransactions, getAllTransactions } = require('../controllers');
const { createPaymentLink, getTransaction, updateTransaction, editPaymentLink, deletePaymentLink, deleteOrganization } = require('../controllers/organizations');
const { authorizeOrg } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/add-organization', addOrganization);
router.get('/', getAllOrganizations);
router.delete('/:organization_id', deleteOrganization);
router.get('/transactions/:organization_id', getOrganizationTransactions);
router.post("/create-payment-link", authorizeOrg, createPaymentLink);
router.get("/transaction/:uuid", getTransaction);
router.patch("/transaction/:uuid", updateTransaction);
router.put("/payment-link/:uuid", authorizeOrg, editPaymentLink);
router.delete("/payment-link/:uuid", authorizeOrg, deletePaymentLink);

module.exports = router;