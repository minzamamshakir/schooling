const router = require("express").Router();
const { auth } = require("../../controllers/auth");
const { admin } = require("../../controllers/admin");
const { inTermsOf } = require("../../controllers/accounts/inTermsOf");
const { permissions } = require("../../controllers/permissions");
router.param("superId", admin.getUserById);
router.post(
  "/:superId/inTermsOf/create",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateInTermsOf,
  inTermsOf.create
);

router.get(
  "/:superId/inTermsOf",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetInTermsOf,
  inTermsOf.all
);
router.get(
  "/:superId/inTermsOf/income",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetIncome,
  inTermsOf.income
);

router.get(
  "/:superId/inTermsOf/expense",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetExpense,
  inTermsOf.expense
);
router.get(
  "/:superId/inTermsOf/studentCharges",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStudentCharges,
  inTermsOf.studentCharges
);

module.exports = router;
