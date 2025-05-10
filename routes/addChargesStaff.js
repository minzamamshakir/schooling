const router = require("express").Router();
const { charges } = require("../controllers/addCharges");
const { auth } = require("../controllers/auth");
const { admin } = require("../controllers/admin");
const { school } = require("../controllers/school");
const { staff } = require("../controllers/staff");
const { permissions } = require("../controllers/permissions");

router.param("staffId", admin.getUserById);
// router.param("staffId", permissions.getPermissionsById);
router.param("schoolId", school.getSchoolById);
router.post(
  "/:staffId/addCharges/create",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateCharges,
  charges.create
);
router.post(
  "/:staffId/addCharges",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetCharges,
  charges.getCharges
);
router.post(
  "/:staffId/addCharges/school/:schoolId",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddChargesToSchool,
  charges.addSchool
);
router.get(
  "/:staffId/addCharges/all",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetCharges,
  charges.all
);
router.post(
  "/:staffId/addCharges/student",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canAddChargesToStudents,
  charges.addStudentCharges
);
module.exports = router;
