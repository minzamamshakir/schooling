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
router.get(
  "/:Id/:school/:session/sectionForStdInfoRepo",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStudentInfoReport,
  classes.getClassBySchool
);
router.post(
  "/:Id/student/studentsBySchoolForStdInfoRepo",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStudentInfoReport,
  student.getStudentBySchool
);
router.post(
  "/:Id/student/studentbyClassForStdInfoRepo",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStudentInfoReport,
  student.getStudentByClass
);
router.post(
  "/:Id/student/studentbySectionForStdInfoRepo",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStudentInfoReport,
  student.getStudentBySection
);
module.exports = router;
