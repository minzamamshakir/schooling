const router = require("express").Router();
const { bonus } = require("../controllers/addBonus");
const { auth } = require("../controllers/auth");
const { admin } = require("../controllers/admin");
const { school } = require("../controllers/school");
const { inTermsOf } = require("../controllers/accounts/inTermsOf");
const { salaryMonth } = require("../controllers/salaryMonth");
const { session } = require("../controllers/session");
const { month } = require("../controllers/month");
const { check } = require("express-validator");
const validationError = require("../controllers/validationError");
const { permissions } = require("../controllers/permissions");

router.param("staffId", admin.getUserById);
// router.param("staffId", permissions.getPermissionsById);
router.param("schoolId", school.getSchoolById);
router.get(
  "/:staffId/getBonus/:schoolId",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetBonus,
  bonus.getBonus
);
router.post(
  "/:staffId/addBonus/school/:schoolId",
  [check("school", "School Id is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddBonusToAllStaffs,
  bonus.addBonusToAllStaffsOfSchool
);
router.post(
  "/:staffId/addBonus/singelStaff",
  [check("regNum", "Reg Num of Staff is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddBonusToSingleStaff,
  bonus.addSingleStaffBonus
);
router.get(
  "/:staffId/inTermsOf/expenseForSingleStaff",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddBonusToSingleStaff,
  inTermsOf.expense
);
router.post(
  "/:staffId/school/sessionsForSingleStaffExpense",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddBonusToSingleStaff,
  session.getSessionBySchool
);
router.get(
  "/:staffId/inTermsOf/expenseForSchool",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddBonusToAllStaffs,
  inTermsOf.expense
);
router.post(
  "/:staffId/school/sessionsForSchoolExpense",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddBonusToAllStaffs,
  session.getSessionBySchool
);
router.post(
  "/:staffId/monthForSchoolExpense",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddBonusToAllStaffs,
  salaryMonth.getSalaryMonth
);
module.exports = router;
