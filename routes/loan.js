const router = require("express").Router();
const { loan } = require("../controllers/loan");
const { auth } = require("../controllers/auth");
const { admin } = require("../controllers/admin");
const { session } = require("../controllers/session");
const { salaryMonth } = require("../controllers/salaryMonth");
const { check } = require("express-validator");
const validationError = require("../controllers/validationError");
const { permissions } = require("../controllers/permissions");
const { school } = require("../controllers/school");
router.param("schoolId", school.getSchoolById);
router.param("staffId", admin.getUserById);
router.get(
  "/:staffId/getLoan/:schoolId",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetLoan,
  loan.getLoan
);
router.post(
  "/:staffId/loan/create",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddLoanToSingleStaff,
  loan.create
);
router.post(
  "/:staffId/school/sessionsForLoan",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddLoanToSingleStaff,
  session.getSessionBySchool
);
module.exports = router;
