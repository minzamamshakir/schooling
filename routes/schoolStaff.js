const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
// getting admin controllers
const { admin } = require("../controllers/admin");
// getting auth controllers
const { auth } = require("../controllers/auth");
// getting school controllers
const { school } = require("../controllers/school");
const { register } = require("../controllers/register");
const { inTermsOf } = require("../controllers/accounts/inTermsOf");
const { staff } = require("../controllers/staff");
const { permissions } = require("../controllers/permissions");
router.param("Id", admin.getUserById);
// router.param("staffId", permissions.getPermissionsById);
router.param("schoolId", school.getSchoolById);
// all post routes
router.post(
  "/:Id/school/create",
  [
    check("name", "name is required"),
    check("num", "Contact Number is required"),
    check("num2", "Contact Number 2  is required"),
    check("email", "School Email is required").isEmail(),
    check("location", "Location is required"),
    check("guardPrefix", "Guardian Prefix is required"),
    check("staffPrefix", "Staff Prefix is required"),
  ],
  auth.isSignedIn,
  auth.isAuthenticated,
  // permissions.canCreateCampus,
  school.create,
  register.guardNum,
  register.certNum,
  inTermsOf.createStudentFee,
  inTermsOf.createStaffSalary,
  register.staffNum
);

// all get routes

router.get(
  "/:Id/school",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetAllSchools,
  school.school
);
router.get(
  "/:Id/school/session",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSchoolSessions,
  school.session
);
router.get(
  "/:Id/school/level",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSchoolLevel,
  school.level
);
router.get(
  "/:Id/school/gender",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSchoolGender,
  school.gender
);
router.get(
  "/:Id/school/class",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSchoolClass,
  school.classes
);
router.get(
  "/:Id/school/section",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSchoolSections,
  school.section
);
router.get(
  "/:Id/school/student",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSchoolStudents,
  school.student
);

router.get(
  "/:Id/school/:schoolId",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSchoolById,
  school.getSingleSchool
);
router.put(
  "/:Id/school/:schoolId/updateSchool",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateSchool,
  school.updateSchool
);
router.post(
  "/:Id/school/students",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleSchoolStudents,
  school.singleSchoolStudents
);
router.post(
  "/:Id/school/guardians",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetGuardiansBySchool,
  school.singleSchoolGuardians
);
router.post(
  "/:Id/school/singleSection",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleSectionBySchool,
  school.getSingleSectionBySchool
);

module.exports = router;
