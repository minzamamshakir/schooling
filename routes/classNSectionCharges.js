const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
// getting admin controllers
const { admin } = require("../controllers/admin");
// getting auth controllers
const { auth } = require("../controllers/auth");
const { session } = require("../controllers/session");
const { school } = require("../controllers/school");
const { inTermsOf } = require("../controllers/accounts/inTermsOf");
const { charges } = require("../controllers/addCharges");
const { classes } = require("../controllers/class");
const { month } = require("../controllers/month");
const { permissions } = require("../controllers/permissions");
const validationError = require("../controllers/validationError");
router.param("Id", admin.getUserById);
router.param("school", school.getSchoolById);
// all post routes
router.post(
  "/:Id/school/sessionsForClassSectionCharges",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddChargesToClassOrSection,
  session.getSessionBySchool
);
router.get(
  "/:Id/inTermsOf/studentChargesForClassSection",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddChargesToClassOrSection,
  inTermsOf.studentCharges
);
router.get(
  "/:Id/:school/:session/getClassAndSectionsForClassSectionCharges",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddChargesToClassOrSection,
  classes.getClassBySchool
);
router.post(
  "/:Id/monthForClassSectionCharges",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddChargesToClassOrSection,
  month.getMonth
);
router.post(
  "/:Id/addCharges/createForClassSection",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddChargesToClassOrSection,
  charges.create
);
module.exports = router;
