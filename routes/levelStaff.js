const express = require("express");
const router = express.Router();
const { admin } = require("../controllers/admin");
const { auth } = require("../controllers/auth");
const { level } = require("../controllers/level");
const { check } = require("express-validator");
const { staff } = require("../controllers/staff");
const { permissions } = require("../controllers/permissions");

router.param("staffId", admin.getUserById);
// router.param("staffId", permissions.getPermissionsById);
router.param("levelId", level.getLevelById);
router.post(
  "/:staffId/level/create",
  [check("name", "name is required")],
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateLevel,
  level.create
);
router.get(
  "/:staffId/level",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetLevels,
  level.all
);
router.get(
  "/:staffId/level/:levelId",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleLevel,
  level.getSingleLevel
);
router.put(
  "/:staffId/level/update",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateLevel,
  level.updateLevel
);

router.post(
  "/:staffId/level/getAllLevelsBySession",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetLevelsBySession,
  level.getAllLevelsBySession
);

module.exports = router;
