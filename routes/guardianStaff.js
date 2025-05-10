const router = require("express").Router();
const { auth } = require("../controllers/auth");
const { admin } = require("../controllers/admin");
const { guardian } = require("../controllers/guardian");
const { staff } = require("../controllers/staff");
const { permissions } = require("../controllers/permissions");
const { user } = require("../controllers/user");
router.param("staffId", admin.getUserById);
// router.param("staffId", permissions.getPermissionsById);
router.param("guardId", guardian.getGuardianById);
router.post(
  "/:staffId/guardians",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetGuardians,
  guardian.all
);
router.get(
  "/:guardId/guardians",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleGuardian,
  guardian.getSingleGuardian
);
router.get(
  "/:staffId/:guardId/guardians",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleGuardian,
  guardian.getSingleGuardian
);
router.put(
  "/:staffId/guardians/:guardId/update",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateGuardian,
  guardian.updateGuardian
);
router.get(
  "/:staffId/guardian/profile",
  auth.isSignedIn,
  auth.isAuthenticated,
  guardian.singleGuardianProfile
);
router.post(
  "/:staffId/updateUserForGuardian",
  auth.isSignedIn,
  auth.isAuthenticated,
  user.updateUserForGuardian
);
module.exports = router;
