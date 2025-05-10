const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
// getting admin controllers
const { admin } = require("../controllers/admin");
// getting auth controllers
const { auth } = require("../controllers/auth");
const { session } = require("../controllers/session");
const { classes } = require("../controllers/class");
const { school } = require("../controllers/school");
const { permissions } = require("../controllers/permissions");
const { student } = require("../controllers/student");
router.param("studentId", student.getStudentById);
router.param("Id", admin.getUserById);
router.param("school", school.getSchoolById);
// all post routes
router.post(
  "/:Id/school/sessionsForActiveInActiveStd",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canDoActiveInactiveToStudent,
  session.getSessionBySchool
);
router.get(
  "/:Id/:school/:session/sectionForActiveInActiveStd",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canDoActiveInactiveToStudent,
  classes.getClassBySchool
);
router.put(
  "/:Id/:studentId/updateStudentForActiveInActive",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canDoActiveInactiveToStudent,
  student.updateStudentForActiveInActive
);
router.get(
  "/:Id/:school/:session/sectionForSubjects",
  auth.isSignedIn,
  auth.isAuthenticated,
  // permissions.canDoActiveInactiveToStudent,
  classes.getClassBySchool
);
module.exports = router;
