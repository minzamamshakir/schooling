const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
// getting admin controllers
const { admin } = require("../controllers/admin");
// getting auth controllers
const { auth } = require("../controllers/auth");
const { guardian } = require("../controllers/guardian");
const { permissions } = require("../controllers/permissions");
const validationError = require("../controllers/validationError");
router.param("Id", admin.getUserById);
router.param("guardId", guardian.getGuardianById);
// all post routes
router.get(
  "/:Id/:guardId/guardianForUpdate",
  [check("guardId", "Guardian Id is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateGuardian,
  guardian.getSingleGuardian
);
module.exports = router;
