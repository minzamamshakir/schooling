const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
// getting admin controllers
const { admin } = require("../controllers/admin");
// getting auth controllers
const { auth } = require("../controllers/auth");
const { guardian } = require("../controllers/guardian");
const { school } = require("../controllers/school");
const { permissions } = require("../controllers/permissions");
const validationError = require("../controllers/validationError");
router.param("Id", admin.getUserById);
router.param("school", school.getSchoolById);
// all post routes
router.post(
  "/:Id/guardianInfoRepo",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetGuardianInfoReport,
  guardian.all
);
module.exports = router;
