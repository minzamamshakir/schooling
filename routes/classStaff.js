const express = require("express");
const router = express.Router();
const { auth } = require("../controllers/auth");
const { admin } = require("../controllers/admin");
const { check } = require("express-validator");
const { classes } = require("../controllers/class");
const { school } = require("../controllers/school");
const { permissions } = require("../controllers/permissions");

router.param("staffId", admin.getUserById);
// router.param("staffId", permissions.getPermissionsById);
router.param("school", school.getSchoolById);
router.param("classId", classes.getClassById);

router.post(
  "/:staffId/class/create",
  [
    check("school", 'School is required to genrate "Class"'),
    check("level", 'Level is required to genrate "Class"'),
    check("session", "Session is required to genrate Session"),
    check("gender", "Gender is required to genrate Session"),
    check("fee", "Fee is required"),
    check("admisionFee", "Fee is required"),
    check("regFee", "Fee is required"),
  ],
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateClass,
  classes.create
);
router.get(
  "/:staffId/class",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetAllClasses,
  classes.all
);
router.get(
  "/:staffId/class/:classId/",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetClassById,
  classes.getSingleClass
);
router.get(
  "/:staffId/class/:classId/students",
  auth.isSignedIn,
  auth.isAuthenticated,
  auth.isAdmin,
  classes.getSingleClassStudents
);
router.put(
  "/:staffId/class/update",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateClass,
  classes.updateClass
);
router.post("/class/classStrength", classes.classStrength);
router.get(
  "/:staffId/:school/:session/section",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetClassSectionBySchool,
  classes.getClassBySchool
);
router.post(
  "/:staffId/class/getClassbyGender",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetClassByGender,
  classes.getClassByGender
);
router.get(
  "/:staffId/:sessionId/class",
  auth.isSignedIn,
  auth.isAuthenticated,
  classes.allClassesBySession
);

module.exports = router;
