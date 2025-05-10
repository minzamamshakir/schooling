const express = require("express");
const router = express.Router();
const { auth } = require("../controllers/auth");
const { admin } = require("../controllers/admin");
const { gender } = require("../controllers/gender");
const { check } = require("express-validator");
const { permissions } = require("../controllers/permissions");
router.param("staffId", admin.getUserById);
router.param("genderId", gender.getGenderById);

router.post(
  "/:staffId/gender/create",
  [
    check("Session", "Session is required"),
    check("level", "Level is required"),
    check("name", "Name is required"),
    check("school", "School is required"),
    check("prefix", "prefix is required"),
    check("count", "count is required"),
  ],
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateGender,
  gender.create
);

router.get(
  "/:staffId/gender",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetGender,
  gender.all
);
router.get(
  "/:staffId/gender/:genderId",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleGender,
  gender.getSingleGender
);
router.put(
  "/:staffId/gender/:genderId/update",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateGender,
  gender.updateGender
);
router.post(
  "/:staffId/gender/getAllGendersByLevel",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetGenderByLevels,
  gender.getAllGendersByLevel
);

module.exports = router;
