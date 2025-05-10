const express = require("express");
const router = express.Router();
// getting admin controllers
const { admin } = require("../controllers/admin");
// getting auth controllers
const { auth } = require("../controllers/auth");
const { school } = require("../controllers/school");
const { permissions } = require("../controllers/permissions");
router.param("Id", admin.getUserById);
router.param("school", school.getSchoolById);

router.get(
  "/:Id/updateSchool/:school",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateSchool,
  school.getSingleSchool
);

module.exports = router;
