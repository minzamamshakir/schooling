const router = require("express").Router();
const { auth } = require("../controllers/auth");
const { admin } = require("../controllers/admin");
const { month } = require("../controllers/month");
const { permissions } = require("../controllers/permissions");

router.param("staffId", admin.getUserById);
// router.param("staffId", permissions.getPermissionsById);

router.post(
  "/:staffId/month/create",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateMonths,
  month.create
);
router.post(
  "/:staffId/month",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetMonths,
  month.getMonth
);

module.exports = router;
