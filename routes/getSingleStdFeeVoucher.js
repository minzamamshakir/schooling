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
const { permissions } = require("../controllers/permissions");
const validationError = require("../controllers/validationError");
router.param("Id", admin.getUserById);
router.param("school", school.getSchoolById);
// all post routes
router.post(
  "/:Id/school/sessionsForGetSingleStdFeeVoucher",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleStudentFeeVoucher,
  session.getSessionBySchool
);
router.post(
  "/:Id/monthForGetSingleStdFeeVoucher",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleStudentFeeVoucher,
  month.getMonth
);
router.post(
  "/:Id/fee/student/forGetSingleStdVoucher",
  [check("regNum", "Admission No. is required").exists()],
  [check("school", "School is required").exists()],
  [check("session", "Session is Requierd").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleStudentFeeVoucher,
  fee.getStudentFee
);
module.exports = router;
