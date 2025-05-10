const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
// getting admin controllers
const { admin } = require("../controllers/admin");
// getting auth controllers
const { auth } = require("../controllers/auth");
// getting school controllers
const { school } = require("../controllers/school");
const { permissions } = require("../controllers/permissions");
const { classes } = require("../controllers/class");
const { student } = require("../controllers/student");
const { attendance } = require("../controllers/attendance");
const { fee } = require("../controllers/accounts/fee");
const validationError = require("../controllers/validationError");
router.param("Id", admin.getUserById);
// router.param("staffId", permissions.getPermissionsById);
router.param("school", school.getSchoolById);
router.param("studentId", student.getStudentById);
// all post routes
router.get(
  "/:Id/:school/:session/getClassAndSectionsforStudent",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStudentByClass,
  classes.getClassBySchool
);
router.get(
  "/:Id/:studentId/singleStudentForUpdate",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStudentBySchool,
  student.getSingleStudentForUser
);
router.post(
  "/:Id/student/allAttendanceOfSingleStd",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStudentBySchool,
  attendance.getStudentAttendance
);
router.post(
  "/:Id/fee/singleStudentForDetail",
  [check("regNum", "Admission No. is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStudentBySchool,
  fee.getSingleStudentFee
);
module.exports = router;
