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
const { student } = require("../controllers/student");
const { classes } = require("../controllers/class");
const validationError = require("../controllers/validationError");
router.param("Id", admin.getUserById);
// router.param("staffId", permissions.getPermissionsById);
router.param("school", school.getSchoolById);
router.param("sectionId", section.getSectionById);
router.param("classId", classes.getClassById);
// all post routes
router.post(
  "/:Id/school/sectionAndClassData",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canPrintStudentCards,
  school.getSingleSectionBySchool
);
router.post(
  "/:Id/student/getStudentForPrintCard",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canPrintStudentCards,
  student.getstudentByRegNo
);
router.get(
  "/:Id/:school/:session/sectionAndClasses",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canPrintStudentCards,
  classes.getClassBySchool
);
router.get(
  "/:Id/class/:classId/studentsCard",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canPrintStudentCards,
  classes.getSingleClassStudents
);
router.get(
  "/:Id/section/:sectionId/studentsCard",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canPrintStudentCards,
  section.getStudents
);
module.exports = router;
