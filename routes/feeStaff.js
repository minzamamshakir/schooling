const express = require("express");
const router = express.Router();
const { auth } = require("../controllers/auth");
const { admin } = require("../controllers/admin");
const { fee } = require("../controllers/fee");
const { check } = require("express-validator");
const { staff } = require("../controllers/staff");
const { permissions } = require("../controllers/permissions");
router.param("staffId", admin.getUserById);
// router.param("staffId", permissions.getPermissionsById);
router.post(
  "/:staffId/fee/create",
  [
    check("school", "School is required"),
    check("session", "Session is required"),
    check("level", "Level is required"),
    check("class", "Class is required"),
    check("fee", "Fee is required"),
    check("admisionFee", "Fee is required"),
    check("regFee", "Fee is required"),
  ],
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateFee,
  fee.create
);
router.post(
  "/:staffId/fee/findOne",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleFeeVoucher,
  fee.findOne
);

module.exports = router;
