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
const { permissions } = require("../controllers/permissions");
const validationError = require("../controllers/validationError");
router.param("Id", admin.getUserById);
router.param("school", school.getSchoolById);
router.param("levelId", level.getLevelById);
// all post routes
router.post(
  "/:Id/school/sessionsForCreateLevel",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateLevel,
  session.getSessionBySchool
);
router.post(
  "/:Id/school/sessionsForUpdateLevel",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateLevel,
  session.getSessionBySchool
);
router.post(
  "/:Id/level/getAllLevelsForUpdateLevel",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateLevel,
  level.getAllLevelsBySession
);
router.get(
  "/:Id/updateLevel/:levelId",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateLevel,
  level.getSingleLevel
);
module.exports = router;
