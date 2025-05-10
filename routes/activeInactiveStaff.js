const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
// getting admin controllers
const { admin } = require("../controllers/admin");
// getting auth controllers
const { auth } = require("../controllers/auth");
const { staff } = require("../controllers/staff");
const { school } = require("../controllers/school");
const { permissions } = require("../controllers/permissions");
router.param("Id", admin.getUserById);
router.param("school", school.getSchoolById);
router.param("staffId", staff.getStaffByIdToSet);
// all post routes
router.get(
  "/:Id/:school/staffsForActiveInActive",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canDoActiveInactiveToStaff,
  staff.getStaffForActiveInActive
);
router.put(
  "/:Id/:staffId/updateSingleStaffForActiveInActive",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canDoActiveInactiveToStaff,
  staff.getStaffById,
  staff.updateStaffForActiveInActive
);
module.exports = router;
