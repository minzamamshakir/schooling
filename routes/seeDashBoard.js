const express = require("express");
const router = express.Router();
// getting admin controllers
const { admin } = require("../controllers/admin");
// getting auth controllers
const { auth } = require("../controllers/auth");
const { school } = require("../controllers/school");
const { staff } = require("../controllers/staff");
const { eventManagement } = require("../controllers/eventManagment");
const { permissions } = require("../controllers/permissions");
router.param("Id", admin.getUserById);
router.param("school", school.getSchoolById);

router.get(
  "/:Id/:school/eventDatesToSeeDashBoard",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canSeeDashboard,
  eventManagement.getAllSchoolDates
);
router.get(
  "/:Id/:school/sectionInchargesToSeeDashBoard",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canSeeDashboard,
  staff.getClassIncharges
);

module.exports = router;
