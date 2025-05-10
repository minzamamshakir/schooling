const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
// getting admin controllers
const { admin } = require("../controllers/admin");
// getting auth controllers
const { auth } = require("../controllers/auth");
const { staff } = require("../controllers/staff");
const { permissions } = require("../controllers/permissions");
const validationError = require("../controllers/validationError");
router.param("Id", admin.getUserById);
router.param("staffId", staff.getStaffByIdToSet);
// all post routes
router.get(
  "/:Id/:staffId/singleStaffForUpdate",
  [check("staffId", "Guardian Id is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateStaff,
  staff.getSingleStaffForUser
);
module.exports = router;
