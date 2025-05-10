const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
// getting admin controllers
const { admin } = require("../controllers/admin");
// getting auth controllers
const { auth } = require("../controllers/auth");
const { session } = require("../controllers/session");
const { school } = require("../controllers/school");
const { level } = require("../controllers/level");
const { gender } = require("../controllers/gender");
const { classes } = require("../controllers/class");
const { section } = require("../controllers/section");
const { student } = require("../controllers/student");
const { guardian } = require("../controllers/guardian");
const { attendance } = require("../controllers/attendance");
const { permissions } = require("../controllers/permissions");
const { user } = require("../controllers/user");
const validationError = require("../controllers/validationError");
router.param("Id", admin.getUserById);
router.param("school", school.getSchoolById);
router.param("sectionId", section.getSectionById);
// all post routes
router.post(
  "/:Id/school/sessionsForAddBulkStudents",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddBulkStudent,
  session.getSessionBySchool
);
router.post(
  "/:Id/level/getAllLevelsForAddBulkStudents",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddBulkStudent,
  level.getAllLevelsBySession
);
router.post(
  "/:Id/gender/getAllGendersForAddBulkStudents",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddBulkStudent,
  gender.getAllGendersByLevel
);
router.post(
  "/:Id/class/getClassForAddBulkStudents",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddBulkStudent,
  classes.getClassByGender
);
router.get(
  "/:Id/singleClassForAddBulkStudents/:classId/",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddBulkStudent,
  classes.getSingleClass
);
router.post(
  "/:Id/section/getSectionForAddBulkStudents",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddBulkStudent,
  section.getAllSectionByClass
);
router.get(
  "/:Id/singleSectionForAddBulkStudents/:sectionId",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddBulkStudent,
  section.getSingleSection
);
router.post(
  "/:Id/addBulkStudent/create",
  [
    check("session", "Session is required"),
    check("level", "Level is required"),
    check("gender", "Gender is required"),
    check("class", "Class is required"),
    check("section", "Section is required"),
    check("stdName", "stdName is required"),
    check("religion", "Religion is required"),
    check("homeAddress", "Home Address is required"),
    check("admissionNo", "Adminssion Number is required"),
    check("dob", "Date of birth is required"),
    check("Roll No", "Roll No is required"),
  ],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddBulkStudent,
  guardian.search,
  guardian.create,
  user.createStepForGuardian,
  student.create,
  permissions.createStepForStudent,
  attendance.sessionAttendence,
  user.createStepForStudent
);
router.post(
  "/:Id/sectionForAddBulkStudent/create",
  [
    check("school", 'School is required to genrate "Section"'),
    check("level", 'Level is required to genrate "Section"'),
    check("gender", 'Gender is required to genrate "Section"'),
    check("class", 'Class is required to genrate "Section"'),
    check("name", 'Name is required to genrate "Section"'),
    check("color", 'Color is required to genrate "Section"'),
  ],
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddBulkStudent,
  section.create
);

module.exports = router;
