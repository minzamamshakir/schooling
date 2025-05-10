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
const { permissions } = require("../controllers/permissions");
const validationError = require("../controllers/validationError");
router.param("Id", admin.getUserById);
router.param("school", school.getSchoolById);
router.param("classId", classes.getClassById);
// all post routes
router.post(
  "/:Id/school/sessionsForCreateClass",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateClass,
  session.getSessionBySchool
);
router.post(
  "/:Id/level/getAllLevelsForCreateClass",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateClass,
  level.getAllLevelsBySession
);
router.post(
  "/:Id/gender/getAllGendersForCreateClass",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateClass,
  gender.getAllGendersByLevel
);
router.post(
  "/:Id/school/sessionsForUpdateClass",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateClass,
  session.getSessionBySchool
);
router.post(
  "/:Id/level/getAllLevelsForUpdateClass",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateClass,
  level.getAllLevelsBySession
);
router.post(
  "/:Id/gender/getAllGendersForUpdateClass",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateClass,
  gender.getAllGendersByLevel
);
router.post(
  "/:Id/class/getClassForUpdateClass",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateClass,
  classes.getClassByGender
);
router.get(
  "/:Id/updateClass/:classId/",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateClass,
  classes.getSingleClass
);

module.exports = router;
