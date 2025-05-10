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
const { permissions } = require("../controllers/permissions");
const validationError = require("../controllers/validationError");
router.param("Id", admin.getUserById);
router.param("school", school.getSchoolById);
router.param("sectionId", section.getSectionById);
// all post routes
router.post(
  "/:Id/school/sessionsForCreateSection",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateSection,
  session.getSessionBySchool
);
router.post(
  "/:Id/level/getAllLevelsForCreateSection",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateSection,
  level.getAllLevelsBySession
);
router.post(
  "/:Id/gender/getAllGendersForCreateSection",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateSection,
  gender.getAllGendersByLevel
);
router.post(
  "/:Id/class/getClassForCreateSection",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateSection,
  classes.getClassByGender
);
router.post(
  "/:Id/school/sessionsForUpdateSection",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateSection,
  session.getSessionBySchool
);
router.post(
  "/:Id/level/getAllLevelsForUpdateSection",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateSection,
  level.getAllLevelsBySession
);
router.post(
  "/:Id/gender/getAllGendersForUpdateSection",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateSection,
  gender.getAllGendersByLevel
);
router.post(
  "/:Id/class/getClassForUpdateSection",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateSection,
  classes.getClassByGender
);
router.post(
  "/:Id/section/getSectionForUpdateSection",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateSection,
  section.getAllSectionByClass
);
router.get(
  "/:Id/updateSection/:sectionId",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateSection,
  section.getSingleSection
);

module.exports = router;
