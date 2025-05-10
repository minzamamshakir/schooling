const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
// getting admin controllers
const { admin } = require("../controllers/admin");
// getting auth controllers
const { auth } = require("../controllers/auth");
// getting school controllers
const { school } = require("../controllers/school");
const { permissions } = require("../controllers/permissions");
const { staff } = require("../controllers/staff");
const validationError = require("../controllers/validationError");
router.param("Id", admin.getUserById);
router.param("school", school.getSchoolById);
// all post routes
router.get(
  "/:Id/:school/allStaffForReport",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStaffInfoReport,
  staff.getStaffBySchool
);
module.exports = router;
