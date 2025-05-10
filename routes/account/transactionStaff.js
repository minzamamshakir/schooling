const router = require("express").Router();
const { auth } = require("../../controllers/auth");
const { admin } = require("../../controllers/admin");
const { transaction } = require("../../controllers/accounts/transaction");
const { permissions } = require("../../controllers/permissions");
const { aggregate } = require("../../controllers/aggregate");
router.param("staffId", admin.getUserById);
router.post(
  "/:staffId/transaction/create",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateTransactions,
  transaction.create
);
router.post(
  "/transaction/update",
  // auth.isSignedIn,
  // auth.isAuthenticated,
  // permissions.canCreateTransactions,
  transaction.updateTransaction
);
router.post(
  "/transaction/balanceSheet",
  // auth.isSignedIn,
  // auth.isAuthenticated,
  // permissions.canGetTransaction,
  aggregate.aggregateOfTransaction
);
router.get(
  "/:staffId/transaction",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetTransaction,
  transaction.all
);

module.exports = router;
