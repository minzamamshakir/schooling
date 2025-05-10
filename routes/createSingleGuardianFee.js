const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
// getting admin controllers
const { admin } = require("../controllers/admin");
// getting auth controllers
const { auth } = require("../controllers/auth");
const { session } = require("../controllers/session");
const { charges } = require("../controllers/addCharges");
const { month } = require("../controllers/month");
const { school } = require("../controllers/school");
const { inTermsOf } = require("../controllers/accounts/inTermsOf");
const { permissions } = require("../controllers/permissions");
const validationError = require("../controllers/validationError");
router.param("Id", admin.getUserById);
router.param("school", school.getSchoolById);
// all post routes
router.post(
  "/:Id/school/sessionsForCreateGuardianFee",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateSingleGuardianFeeVoucher,
  session.getSessionBySchool
);
router.post(
  "/:Id/monthForCreateGuardianFee",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateSingleGuardianFeeVoucher,
  month.getMonth
);

module.exports = router;
