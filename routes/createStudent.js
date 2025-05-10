const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
// getting admin controllers
const { admin } = require("../controllers/admin");
// getting auth controllers
const { auth } = require("../controllers/auth");
// getting school controllers
const { school } = require("../controllers/school");
const { section } = require("../controllers/section");
const { permissions } = require("../controllers/permissions");
const { fee } = require("../controllers/accounts/fee");
const validationError = require("../controllers/validationError");
router.param("Id", admin.getUserById);
// router.param("staffId", permissions.getPermissionsById);
router.param("schoolId", school.getSchoolById);
router.param("sectionId", section.getSectionById);
// all post routes
router.post(
  "/:Id/school/allocationData",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateStudent,
  school.getSingleSectionBySchool
);
router.get(
  "/:Id/section/:sectionId/stdRollNo",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateStudent,
  section.getRollNo
);
router.post(
  "/:Id/fee/createSingleStudentVoucher",
  [check("admissionNo", "Admission No. is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateStudent,
  fee.creatSingleStudentFee
);

module.exports = router;
