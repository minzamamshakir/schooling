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
const validationError = require("../controllers/validationError");
router.param("Id", admin.getUserById);
router.param("school", school.getSchoolById);
// all post routes
// router.post(
//   "/:Id/school/sessionsForGetResult",
//   auth.isSignedIn,
//   auth.isAuthenticated,
//   permissions.canGetResult,
//   session.getSessionBySchool
// );
router.get(
  "/:Id/:school/:session/sectionForGetAttendance",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetAttendance,
  classes.getClassBySchool
);
module.exports = router;
