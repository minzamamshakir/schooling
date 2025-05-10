const router = require("express").Router();
const { loanHistory } = require("../controllers/loanHistory");
const { auth } = require("../controllers/auth");
const { admin } = require("../controllers/admin");
const { check } = require("express-validator");
const validationError = require("../controllers/validationError");
const { permissions } = require("../controllers/permissions");
router.param("staffId", admin.getUserById);
router.get(
  "/:staffId/getLoanHistory",
  auth.isSignedIn,
  auth.isAuthenticated,
  //   permissions.canGetBonus,
  loanHistory.getLoanHistory
);
router.post(
  "/:staffId/loanHistory/create",
  [check("staffId", "Staff Id is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  //   permissions.canAddBonusToAllStaffs,
  loanHistory.create
);
module.exports = router;
