const router = require("express").Router();
const { auth } = require("../controllers/auth");
const { admin } = require("../controllers/admin");
const { salaryMonth } = require("../controllers/salaryMonth");
const { permissions } = require("../controllers/permissions");

router.param("staffId", admin.getUserById);
// router.param("staffId", permissions.getPermissionsById);

router.post(
  "/salaryMonth/create",
  // auth.isSignedIn,
  // auth.isAuthenticated,
  //   permissions.canCreateMonths,
  salaryMonth.create
);
router.post(
  "/:staffId/salaryMonth",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetMonths,
  salaryMonth.getSalaryMonth
);

module.exports = router;
