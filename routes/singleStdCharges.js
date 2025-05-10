const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
// getting admin controllers
const { admin } = require("../controllers/admin");
// getting auth controllers
const { auth } = require("../controllers/auth");
const { session } = require("../controllers/session");
const { school } = require("../controllers/school");
const { inTermsOf } = require("../controllers/accounts/inTermsOf");
const { permissions } = require("../controllers/permissions");
const validationError = require("../controllers/validationError");
router.param("Id", admin.getUserById);
router.param("school", school.getSchoolById);
// all post routes
router.post(
  "/:Id/school/sessionsForSingleStdCharges",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddChargesToStudents,
  session.getSessionBySchool
);
router.get(
  "/:Id/inTermsOf/studentChargesforSingleStd",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddChargesToStudents,
  inTermsOf.studentCharges
);
module.exports = router;
