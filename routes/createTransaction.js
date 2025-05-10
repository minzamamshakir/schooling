const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
// getting admin controllers
const { admin } = require("../controllers/admin");
// getting auth controllers
const { auth } = require("../controllers/auth");
const { inTermsOf } = require("../controllers/accounts/inTermsOf");
const { school } = require("../controllers/school");
const { permissions } = require("../controllers/permissions");
const validationError = require("../controllers/validationError");
router.param("Id", admin.getUserById);
router.param("school", school.getSchoolById);
// all post routes
router.get(
  "/:Id/expenseForCreateTransactions",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateTransactions,
  inTermsOf.expense
);

module.exports = router;
