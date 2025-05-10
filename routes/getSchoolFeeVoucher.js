const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
// getting admin controllers
const { admin } = require("../controllers/admin");
// getting auth controllers
const { auth } = require("../controllers/auth");
const { session } = require("../controllers/session");
const { fee } = require("../controllers/accounts/fee");
const { month } = require("../controllers/month");
const { school } = require("../controllers/school");
const { inTermsOf } = require("../controllers/accounts/inTermsOf");
const { permissions } = require("../controllers/permissions");
const validationError = require("../controllers/validationError");
router.param("Id", admin.getUserById);
router.param("school", school.getSchoolById);
// all post routes
router.post(
  "/:Id/school/sessionsForGetSchoolFeeVoucher",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSchoolFeeVoucher,
  session.getSessionBySchool
);
router.post(
  "/:Id/monthForGetSchoolFeeVoucher",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSchoolFeeVoucher,
  month.getMonth
);
router.post(
  "/:Id/fee/guardiansBySchool",
  [check("month", "Months are required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSchoolFeeVoucher,
  fee.getGuardianWiseFee
);
router.post(
  "/:Id/fee/studentsBySchool",
  [check("month", "Months are required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSchoolFeeVoucher,
  fee.getStudentFeeVoucher
);
module.exports = router;
