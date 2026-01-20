const express = require('express');
const { addOrganization, getAllOrganizations, getOrganizationTransactions, getAllTransactions } = require('../controllers');
const { createPaymentLink, getTransaction, updateTransaction } = require('../controllers/organizations');
const { authorizeOrg } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/add-organization', addOrganization);
router.get('/', getAllOrganizations);
router.get('/:organization_id/transactions', getOrganizationTransactions);
router.post("/create-payment-link", authorizeOrg, createPaymentLink);
router.get("/transaction/:uuid", getTransaction);
router.patch("/transaction/:uuid", updateTransaction);

module.exports = router;