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
const { permissions } = require("../controllers/permissions");
const validationError = require("../controllers/validationError");
router.param("Id", admin.getUserById);
router.param("school", school.getSchoolById);
router.param("genderId", gender.getGenderById);
// all post routes
router.post(
  "/:Id/school/sessionsForCreateGender",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateGender,
  session.getSessionBySchool
);
router.post(
  "/:Id/level/getAllLevelsForCreateGender",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateGender,
  level.getAllLevelsBySession
);
router.post(
  "/:Id/school/sessionsForUpdateGender",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateGender,
  session.getSessionBySchool
);
router.post(
  "/:Id/level/getAllLevelsForUpdateGender",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateGender,
  level.getAllLevelsBySession
);
router.post(
  "/:Id/gender/getAllGendersForUpdateGender",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateGender,
  gender.getAllGendersByLevel
);
router.get(
  "/:Id/updateGender/:genderId",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateGender,
  gender.getSingleGender
);

module.exports = router;
