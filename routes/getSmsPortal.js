const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
// getting admin controllers
const { admin } = require("../controllers/admin");
// getting auth controllers
const { auth } = require("../controllers/auth");
const { student } = require("../controllers/student");
const { classes } = require("../controllers/class");
const { school } = require("../controllers/school");
const { permissions } = require("../controllers/permissions");
const validationError = require("../controllers/validationError");
router.param("Id", admin.getUserById);
router.param("school", school.getSchoolById);
// all post routes
router.post(
  "/:Id/student/singleStdContactForSmsPortal",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleStudentContact,
  student.getStudentContact
);
router.get(
  "/:Id/:school/:session/sectionForSmsPortal",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleSectionContact,
  classes.getClassBySchool
);
router.post(
  "/:Id/student/studentbyClassForSmsPortal",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleClassContact,
  student.getStudentByClass
);
router.post(
  "/:Id/student/studentbySectionForSmsPortal",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleSectionContact,
  student.getStudentBySection
);
router.post(
  "/:Id/student/studentsBySchoolForSmsPortal",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleSchoolContact,
  student.getStudentBySchool
);
module.exports = router;
