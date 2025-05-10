const router = require("express").Router();
const { auth } = require("../controllers/auth");
const { admin } = require("../controllers/admin");
const { receiveMonth } = require("../controllers/receiveMonth");
const { permissions } = require("../controllers/permissions");
const { month } = require("../controllers/month");
router.param("superId", admin.getUserById);

router.post(
  "/:superId/receiveMonth/create",
  auth.isSignedIn,
  auth.isAuthenticated,
  auth.isSuperAdmin,
  receiveMonth.create
);
router.post(
  "/:superId/receiveMonth",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetReceiveMonth,
  receiveMonth.getMonth
);

module.exports = router;
